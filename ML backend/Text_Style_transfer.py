import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import os
from tqdm import tqdm
from optimize import Optimize
class StyleTransferGenerator:
    def __init__(self, model_path):
        """
        Initialize the style transfer generator with a saved model.

        Args:
            model_path (str): Path to the saved model checkpoint
        """
        # Determine device
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Load the saved model state with appropriate device mapping
        self.checkpoint = torch.load(
            model_path,
            map_location=self.device,
            weights_only=True  # Address the FutureWarning
        )

        # Initialize tokenizer from the local path (if saved locally)
        self.tokenizer = GPT2Tokenizer.from_pretrained("distilgpt2")  # Use model_path if the tokenizer is saved locally

        # Add special tokens
        special_tokens = {
            'additional_special_tokens': ['<normal>', '<happy>', '<sad>', '<angry>'],
            'pad_token': '<|pad|>'
        }
        self.tokenizer.add_special_tokens(special_tokens)

        # Initialize model from the local path
        self.model = GPT2LMHeadModel.from_pretrained("distilgpt2")  # Use model_path if the model is saved locally
        self.model.resize_token_embeddings(len(self.tokenizer))
        self.optimize = Optimize()

        try:
            # Load the trained weights
            self.model.load_state_dict(self.checkpoint['model_state_dict'])
        except RuntimeError as e:
            print(f"Error loading model weights: {e}")
            print("Attempting to fix state dict keys...")
            # Try to fix state dict if keys don't match exactly
            fixed_state_dict = {}
            for key in self.checkpoint['model_state_dict'].keys():
                if key.startswith('module.'):
                    fixed_state_dict[key[7:]] = self.checkpoint['model_state_dict'][key]
                else:
                    fixed_state_dict[key] = self.checkpoint['model_state_dict'][key]
            self.model.load_state_dict(fixed_state_dict)

        # Move model to device
        self.model.to(self.device)

        # Set model to evaluation mode
        self.model.eval()

        # Valid style tokens
        self.valid_styles = ['<normal>', '<happy>', '<sad>', '<angry>']

    def generate_styled_text(self, input_text, target_style, max_length=64, num_return_sequences=1):
        """
        Generate text in the target style based on input text.

        Args:
            input_text (str): Input text to transform
            target_style (str): Target style token ('<happy>', '<sad>', '<angry>', '<normal>')
            max_length (int): Maximum length of generated sequence
            num_return_sequences (int): Number of different sequences to generate

        Returns:
            list: List of generated texts
        """
        # Validate style token
        if target_style not in self.valid_styles:
            raise ValueError(f"Style must be one of {self.valid_styles}")

        try:
            # Prepare input text
            input_text = f"{target_style} {input_text}"

            # Tokenize input
            inputs = self.tokenizer(
                input_text,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=max_length
            ).to(self.device)

            # Generate text
            generated_texts = []
            with torch.no_grad():
                for _ in tqdm(range(num_return_sequences), desc="Generating text", unit="sequence"):
                    output = self.model.generate(
                        inputs["input_ids"],
                        max_length=max_length,
                        do_sample=True,
                        top_p=0.95,
                        top_k=50,
                        temperature=0.7,
                        pad_token_id=self.tokenizer.pad_token_id,
                        attention_mask=inputs["attention_mask"],
                        no_repeat_ngram_size=2
                    )
                    # Decode the generated sequence
                    generated_text = self.tokenizer.decode(output[0], skip_special_tokens=True)
                    generated_texts.append(generated_text)

            return generated_texts

        except Exception as e:
            print(f"Error during text generation: {e}")
            return [f"Error generating text: {str(e)}"]



    def getOutput(self, input_text, target_style):
        try:
            # Example usage
            model_path = "models/Text Style Transfer/distilgpt2_text_style_transfer.pt"

            # Check if model file exists
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")

            generator = StyleTransferGenerator(model_path)

            userInput = input_text
            result = generator.generate_styled_text(
                userInput,
                target_style,
                num_return_sequences=1
            )
            response = self.optimize.OptimizeTextStyleTransfer(userInput, target_style,result)
            return response

        except Exception as e:
            print(f"An error occurred: {e}")
            raise
