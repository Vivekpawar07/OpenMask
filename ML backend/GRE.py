from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
import evaluate
model_name = 'models/GRE MODEL/fine_tuned_t5_grammar'
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

custom_input = ["She don’t like apples."]  # Example custom input

inputs = [f"correct grammar: {sentence}" for sentence in custom_input]
inputs_tokenized = tokenizer(inputs, return_tensors="pt", padding="max_length", max_length=64, truncation=True)

model.eval()
with torch.no_grad():
    generated_ids = model.generate(inputs_tokenized["input_ids"], max_length=64)


predictions = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
print(f"Predictions: {predictions}")


expected_output = [" She doesn’t like apples."]  # Replace this with the correct version for comparison


bleu = evaluate.load("sacrebleu")
rouge = evaluate.load("rouge")


decoded_labels_for_bleu = [[label] for label in expected_output]

# Compute ROUGE score
rouge_result = rouge.compute(predictions=predictions, references=expected_output)
print(f"ROUGE Scores: {rouge_result}")

# Compute BLEU score
bleu_result = bleu.compute(predictions=predictions, references=decoded_labels_for_bleu)
print(f"BLEU Score: {bleu_result['score']}")