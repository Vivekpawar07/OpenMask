import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
import os
from typing import List, Dict
import json
model_path = 'models/Tag generator/best_model.pth'
vocab_path = 'models/Tag generator/vocabulary.json'
class ImageEncoder(nn.Module):
    def __init__(self, embedding_dim: int):
        super().__init__()
        self.efficientnet = models.efficientnet_b0(pretrained=True)
        self.efficientnet = nn.Sequential(*list(self.efficientnet.children())[:-1])

        self.feature_layers = nn.Sequential(
            nn.Linear(1280, embedding_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.LayerNorm(embedding_dim)
        )

        self.hidden_projection = nn.Linear(embedding_dim, embedding_dim)

    def forward(self, x):
        x = self.efficientnet(x)
        x = x.view(x.size(0), -1)
        features = self.feature_layers(x)

        # Project features to initialize hidden state
        # Shape: [batch_size, embedding_dim] -> [num_layers * num_directions, batch_size, hidden_dim]
        hidden = self.hidden_projection(features)
        hidden = hidden.unsqueeze(0).repeat(4, 1, 1)  # 4 = num_layers(2) * num_directions(2)

        return features, hidden

class TagDecoder(nn.Module):
    def __init__(self, embedding_dim: int, hidden_dim: int, vocab_size: int, max_seq_length: int):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)

        self.hidden_dim = embedding_dim  

        self.gru = nn.GRU(
            input_size=embedding_dim,
            hidden_size=embedding_dim,
            num_layers=2,
            batch_first=True,
            dropout=0.3,
            bidirectional=True
        )

        self.attention = nn.Sequential(
            nn.Linear(embedding_dim * 2, embedding_dim),
            nn.Tanh(),
            nn.Linear(embedding_dim, 1)
        )

        self.output_projection = nn.Sequential(
            nn.Linear(embedding_dim * 2, embedding_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(embedding_dim, vocab_size)
        )

    def forward(self, encoder_output, hidden, target_sequence=None, teacher_forcing_ratio=0.5):
        batch_size = encoder_output.size(0)
        device = encoder_output.device

        decoder_input = torch.zeros(batch_size, 1, dtype=torch.long, device=device)

        outputs = []
        max_length = target_sequence.size(1) if self.training and target_sequence is not None else 10

        for t in range(max_length):
            embedded = self.embedding(decoder_input)
            output, hidden = self.gru(embedded, hidden)

            # Apply attention
            attention_weights = self.attention(output).squeeze(-1)
            attention_weights = torch.softmax(attention_weights, dim=1)
            context = torch.bmm(attention_weights.unsqueeze(1), output).squeeze(1)

            prediction = self.output_projection(context)
            outputs.append(prediction.unsqueeze(1))

            teacher_force = torch.rand(1).item() < teacher_forcing_ratio
            if self.training and target_sequence is not None and teacher_force:
                decoder_input = target_sequence[:, t:t+1]
            else:
                decoder_input = prediction.argmax(-1).unsqueeze(1)

        return torch.cat(outputs, dim=1)

class ImageTagModel(nn.Module):
    def __init__(self, embedding_dim: int, vocab_size: int, max_seq_length: int):
        super().__init__()
        self.encoder = ImageEncoder(embedding_dim)
        self.decoder = TagDecoder(
            embedding_dim=embedding_dim,
            hidden_dim=embedding_dim,  # Use same dimension throughout
            vocab_size=vocab_size,
            max_seq_length=max_seq_length
        )

        # Initialize weights
        self.apply(self._init_weights)

    def _init_weights(self, module):
        if isinstance(module, (nn.Linear, nn.Embedding)):
            module.weight.data.normal_(mean=0.0, std=0.02)
            if isinstance(module, nn.Linear) and module.bias is not None:
                module.bias.data.zero_()

    def forward(self, images, target_sequence=None):
        encoder_output, hidden = self.encoder(images)
        decoder_output = self.decoder(encoder_output, hidden, target_sequence)
        return decoder_output

class ImageTagger:
    def __init__(self, model_path: str = model_path, vocab_path: str = vocab_path, device: str = None):
        if device is None:
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        else:
            self.device = device

        # Load vocabulary
        with open(vocab_path, 'r') as f:
            vocab_data = json.load(f)
            self.tag_to_idx = vocab_data['tag_to_idx']
            self.idx_to_tag = {int(k): v for k, v in vocab_data['idx_to_tag'].items()}

        self.model = ImageTagModel(
            embedding_dim=768,
            vocab_size=len(self.tag_to_idx),
            max_seq_length=10
        )

        checkpoint = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.to(self.device)
        self.model.eval()

        # Define image transformation
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                              std=[0.229, 0.224, 0.225])
        ])

    def predict_tags(self, image_path: str, top_k: int = 5) -> List[str]:
        """
        Predict tags for a given image
        Args:
            image_path: Path to the image file
            top_k: Number of top tags to return
        Returns:
            List of predicted tags
        """
        # Load and transform image
        image = Image.open(image_path).convert('RGB')
        image = self.transform(image)
        image = image.unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(image)

        # Process predictions
        predictions = []
        for step_output in outputs[0]:  # Process each step in the sequence
            probs = torch.softmax(step_output, dim=0)
            top_indices = torch.topk(probs, k=top_k).indices.tolist()

            for idx in top_indices:
                tag = self.idx_to_tag.get(idx, '')
                if tag not in ['<START>', '<END>', '<PAD>'] and tag not in predictions:
                    predictions.append(tag)
                    if len(predictions) >= top_k:
                        break

            if len(predictions) >= top_k:
                break

        return predictions

def test_model(image_path: str, model_path: str, vocab_path: str):
    """
    Test the model on a single image
    Args:
        image_path: Path to the image file
        model_path: Path to the saved model checkpoint
        vocab_path: Path to the saved vocabulary
    """
    # Initialize tagger
    tagger = ImageTagger(model_path, vocab_path)

    try:
        # Predict tags
        predicted_tags = tagger.predict_tags(image_path)

        # Print results
        print(f"\nImage: {os.path.basename(image_path)}")
        print("Predicted tags:", ", ".join(predicted_tags))

    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")

