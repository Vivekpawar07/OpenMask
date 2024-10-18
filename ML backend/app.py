import pickle
from scipy.sparse import hstack
from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
from textblob import TextBlob
import os
from sentence_transformers import SentenceTransformer
from PIL import Image
import warnings
import io
import numpy as np
from nudenet import NudeDetector

warnings.filterwarnings("ignore")

UPLOAD_FOLDER = './images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
model = SentenceTransformer('clip-ViT-L-14')
app = FastAPI()
grammar_model_name = 'models/GRE MODEL/fine_tuned_t5_grammar'
tokenizer = T5Tokenizer.from_pretrained(grammar_model_name)
grammar_model = T5ForConditionalGeneration.from_pretrained(grammar_model_name)

# Initialize the NudeClassifier
nudity_classifier = NudeDetector()

class_names = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']


def resize_image(file_path, size=(224, 224)):
    img = Image.open(file_path)
    img = img.resize(size)
    img.save(file_path)


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


@app.post("/predict_toxicity")
async def predict_toxicity_api(request: Request):
    try:
        data = await request.json()
        user_input = data.get('input', '')
        if not user_input:
            raise HTTPException(status_code=400, detail="Input field is required")

        predictions, probs = predict_toxicity(user_input)
        is_toxic = [key for key, value in predictions.items() if value]

        if len(is_toxic) > 0:
            return JSONResponse(status_code=400,
                                content={"error": "Text is not suitable for posting", "reason": is_toxic})

        return {"predictions": predictions}
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid JSON structure")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/correct_grammar")
async def correct_grammar_api(request: Request):
    data = await request.json()
    custom_input = data.get('input', '')
    if not custom_input:
        raise HTTPException(status_code=400, detail="Input field is required")

    corrected_input = str(TextBlob(custom_input).correct())
    inputs_tokenized = tokenizer(corrected_input, return_tensors="pt", padding="max_length", max_length=64,
                                 truncation=True)

    grammar_model.eval()
    with torch.no_grad():
        generated_ids = grammar_model.generate(inputs_tokenized["input_ids"], max_length=64)

    predictions = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
    return {"predictions": predictions}


@app.post("/get_embeddings")
async def get_embeddings(image: UploadFile = File(...)):
    try:
        if image.filename == '':
            raise HTTPException(status_code=400, detail="No selected file")

        file_path = os.path.join(UPLOAD_FOLDER, image.filename)

        # Save and resize the image
        with open(file_path, "wb") as f:
            f.write(await image.read())
        resize_image(file_path)

        # Generate embeddings
        embeddings = model.encode(file_path, convert_to_tensor=True)

        os.remove(file_path)

        return {"embeddings": embeddings.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/check_nudity")
async def check_nudity(image: UploadFile = File(...)):
    try:
        if image.filename == '':
            raise HTTPException(status_code=400, detail="No selected file")

        # Save the image temporarily
        file_path = os.path.join(UPLOAD_FOLDER, image.filename)
        with open(file_path, "wb") as f:
            f.write(await image.read())

        # Classify the image for nudity
        results = nudity_classifier.detect(file_path)

        # Clean up: remove the saved image
        os.remove(file_path)

        # if results['label'] == 'Nudity':
        #     return JSONResponse(status_code=400, content={"error": "Image contains nudity"})
        # else:
        #     return {"message": "Image is safe"}
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host='0.0.0.0', port=3007)