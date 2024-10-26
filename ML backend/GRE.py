from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
from optimize import Optimize

class GEC:
    def __init__(self):
        self.model_name = 'models/GRE MODEL/fine_tuned_t5_grammar'
        self.tokenizer = T5Tokenizer.from_pretrained(self.model_name)
        self.model = T5ForConditionalGeneration.from_pretrained(self.model_name)
        self.optimize = Optimize()

    def CorrectSentence(self, sentence):
        inputs_tokenized = self.tokenizer(sentence, return_tensors="pt", padding="max_length", max_length=64,
                                           truncation=True)
        self.model.eval()
        with torch.no_grad():
            generated_ids = self.model.generate(inputs_tokenized["input_ids"], max_length=64)
        predictions = self.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
        output = self.optimize.OptimizeGEC(predictions[0])
        return output
