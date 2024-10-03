import pickle
from scipy.sparse import hstack
from flask import Flask, request, jsonify
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
from textblob import TextBlob

app = Flask(__name__)

grammar_model_name = 'models/GRE MODEL/fine_tuned_t5_grammar'
tokenizer = T5Tokenizer.from_pretrained(grammar_model_name)
grammar_model = T5ForConditionalGeneration.from_pretrained(grammar_model_name)


class_names = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']

# Load vectorizers
with open('models/Sentiment Model/models/word_vectorizer.pkl', 'rb') as f:
    word_vectorizer = pickle.load(f)

with open('models/Sentiment Model/models/char_vectorizer.pkl', 'rb') as f:
    char_vectorizer = pickle.load(f)


classifiers = {}
for class_name in class_names:
    classifier_file = f'models/Sentiment Model/models/classifier_{class_name}.pkl'
    with open(classifier_file, 'rb') as f:
        classifiers[class_name] = pickle.load(f)

def predict_toxicity(user_input):
    THRESHOLD = 0.75
    user_word_features = word_vectorizer.transform([user_input])
    user_char_features = char_vectorizer.transform([user_input])
    user_features = hstack([user_char_features, user_word_features])

    predictions = {}
    probs = {}
    for class_name in class_names:
        classifier = classifiers[class_name]
        proba = classifier.predict_proba(user_features)[:, 1][0]
        predictions[class_name] = True if proba > THRESHOLD else False
        probs[class_name] = proba

    return predictions, probs

@app.route('/predict_toxicity', methods=['POST'])
def predict_toxicity_api():

    data = request.json
    user_input = data.get('input', '')


    predictions,probs = predict_toxicity(user_input)

    return jsonify(predictions,probs)

@app.route('/correct_grammar', methods=['POST'])
def correct_grammar_api():
    data = request.json
    custom_input = data.get('input', [])

    corrected_input = str(TextBlob(custom_input).correct())

    inputs_tokenized = tokenizer(corrected_input, return_tensors="pt", padding="max_length", max_length=64, truncation=True)

    grammar_model.eval()
    with torch.no_grad():
        generated_ids = grammar_model.generate(inputs_tokenized["input_ids"], max_length=64)

    predictions = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)

    return jsonify(predictions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002)
    app.run(debug=True)