import pickle

import numpy as np
from scipy.sparse import hstack

class_names = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']

class Offensivetext:
    def __init__(self, word_vector_path='models/Sentiment Model/models/word_vectorizer.pkl',
                 char_vector_path='models/Sentiment Model/models/char_vectorizer.pkl',
                 classifier_paths=None):
        """
        Initializes the Offensivetext class with offensive text categories and loads word and character vectorizers.

        Attributes:
        - class_names (list): A list of offensive text categories.
        - word_vectors (object): Word vectorizer loaded from the specified pickle file.
        - char_vectors (object): Character vectorizer loaded from the specified pickle file.
        - classifiers (dict): Dictionary to hold classifiers for each class.

        Parameters:
        - word_vector_path (str): Path to the word vectorizer pickle file.
        - char_vector_path (str): Path to the character vectorizer pickle file.
        - classifier_paths (dict): Dictionary containing paths for each classifier.
        """
        self.class_names = class_names
        self.classifiers = {}

        # Load word and character vectorizers
        self.word_vectors = self.load_model(word_vector_path, "word vectorizer")
        self.char_vectors = self.load_model(char_vector_path, "character vectorizer")

        # Load classifiers for each class
        if classifier_paths is None:
            classifier_paths = {name: f'models/Sentiment Model/models/classifier_{name}.pkl' for name in self.class_names}

        for class_name, path in classifier_paths.items():
            self.classifiers[class_name] = self.load_model(path, f"classifier for {class_name}")

    def load_model(self, path, model_name):
        """Load a model from the specified path."""
        try:
            with open(path, 'rb') as f:
                return pickle.load(f)
        except FileNotFoundError:
            print(f"Error: {model_name} file not found at {path}.")
            return None
        except Exception as e:
            print(f"Error loading {model_name}: {e}")
            return None

    def _transform_input(self, text):
        """Transforms input text into features for prediction."""
        text_words_features = self.word_vectors.transform([text])
        text_char_features = self.char_vectors.transform([text])
        return hstack([text_char_features, text_words_features])

    def predict_toxicity(self, text):
        """
        Predicts toxicity for the toxicity class.

        Parameters:
        - text (str): The input text to analyze.

        Returns:
        - float: The probability of toxicity.
        """
        return self._predict_class('toxic', text)

    def predict_severe_toxicity(self, text):
        """Predicts severe toxicity for the input text."""
        return self._predict_class('severe_toxic', text)

    def predict_obscene(self, text):
        """Predicts obscenity for the input text."""
        return self._predict_class('obscene', text)

    def predict_threat(self, text):
        """Predicts threats for the input text."""
        return self._predict_class('threat', text)

    def predict_insult(self, text):
        """Predicts insults for the input text."""
        return self._predict_class('insult', text)

    def predict_identity_hate(self, text):
        """Predicts identity hate for the input text."""
        return self._predict_class('identity_hate', text)

    def _predict_class(self, class_name, text):
        """Predicts the probability for a given class name."""
        features = self._transform_input(text)
        classifier = self.classifiers.get(class_name)
        output = {
            f'{class_name}': None
        }
        if classifier is not None:
            result = classifier.predict_proba(features)[:, 1][0]
            output[class_name] = result
            return output
        else:
            print(f"{class_name} classifier is not loaded.")
            return None

    def predict_all(self, text, threshold=0.75):
        """
        Predicts the toxicity of the input text for all classes and applies a threshold.

        Parameters:
        - text (str): The input text to analyze.
        - threshold (float): The probability threshold for classification.

        Returns:
        - dict: A dictionary with binary predictions and probabilities for each class.
        """
        individual_probs = {class_name: self._predict_class(class_name, text) for class_name in self.class_names}

        predictions = {
            class_name: {
                'probability': proba[class_name]
            }
            for class_name, proba in individual_probs.items()
        }
        return predictions

