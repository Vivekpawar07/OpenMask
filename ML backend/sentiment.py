import pickle
from scipy.sparse import hstack
import numpy as np
import sklearn
import warnings
class_names = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
# Load vectorizers
with open('models/Sentiment Model/models/word_vectorizer.pkl', 'rb') as f:
    word_vectorizer = pickle.load(f)

with open('models/Sentiment Model/models/char_vectorizer.pkl', 'rb') as f:
    char_vectorizer = pickle.load(f)

# Load classifiers
classifiers = {}
for class_name in class_names:
    classifier_file = f'models/Sentiment Model/models/classifier_{class_name}.pkl'
    with open(classifier_file, 'rb') as f:
        classifiers[class_name] = pickle.load(f)
def predict_toxicity(user_input):
    # Transform user input
    user_word_features = word_vectorizer.transform([user_input])
    user_char_features = char_vectorizer.transform([user_input])
    user_features = hstack([user_char_features, user_word_features])

    # Predict probabilities for each class
    predictions = {}
    for class_name in class_names:
        classifier = classifiers[class_name]
        proba = classifier.predict_proba(user_features)[:, 1][0]
        predictions[class_name] = proba

    return predictions

# Example user input
user_input = "lets kill that bitch"
predictions = predict_toxicity(user_input)

print(predictions)
