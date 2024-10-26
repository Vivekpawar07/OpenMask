
import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel

class StyleTransferInference:
    def __init__(self, model_path='model.pt'):
        self.checkpoint = torch.load(model_path)
        self.tokenizer = GPT2Tokenizer.from_pretrained(self.checkpoint['tokenizer_name'])
        self.tokenizer.add_special_tokens(self.checkpoint['special_tokens'])
        self.model = GPT2LMHeadModel.from_pretrained("distilgpt2")
        self.model.resize_token_embeddings(len(self.tokenizer))
        self.model.load_state_dict(self.checkpoint['model_state_dict'])
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.model.eval()

    def generate_text(self, input_text, target_style, max_length=64):
        """
        Generate style-transferred text
        """
        prompt = f"<normal> {input_text}"
        target_prompt = f"<{target_style}>"


        inputs = self.tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_length=max_length,
                num_return_sequences=1,
                num_beams=5,
                temperature=0.7,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                pad_token_id=self.tokenizer.pad_token_id,
                bos_token_id=self.tokenizer.bos_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )

        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return generated_text

