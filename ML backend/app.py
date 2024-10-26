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
from sentiment import Offensivetext
from typing import Dict
from GRE import GEC
from Text_Style_transfer import StyleTransferGenerator

ST = StyleTransferGenerator('models/Text Style Transfer/distilgpt2_text_style_transfer.pt')
GEC = GEC()
offensive_text = Offensivetext()
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

class_thresholds = {
            "BUTTOCKS_EXPOSED": 0.85,
            "FEMALE_BREAST_EXPOSED": 0.75,
            "FEMALE_GENITALIA_EXPOSED": 0.55,
            "ANUS_EXPOSED": 0.75,
            "MALE_GENITALIA_EXPOSED": 0.55,
}
def resize_image(file_path, size=(224, 224)):
    img = Image.open(file_path)
    img = img.resize(size)
    img.save(file_path)
@app.post("/predict_toxicity")
async def predict_toxicity_api(request: Request):
    try:
        data = await request.json()
        print(data)
        user_input = data.get('input', '')
        if not user_input:
            raise HTTPException(status_code=400, detail="Input field is required")
        prediction = offensive_text.predict_all(user_input)
        response = {
            'toxic': {
                'is_offensive': bool(prediction['toxic']['is_offensive']),
                'probability': float(prediction['toxic']['probability'])
            },
            'severe_toxic': {
                'is_offensive': bool(prediction['severe_toxic']['is_offensive']),
                'probability': float(prediction['severe_toxic']['probability'])
            },
            'obscene': {
                'is_offensive': bool(prediction['obscene']['is_offensive']),
                'probability': float(prediction['obscene']['probability'])
            },
            'threat': {
                'is_offensive': bool(prediction['threat']['is_offensive']),
                'probability': float(prediction['threat']['probability'])
            },
            'insult': {
                'is_offensive': bool(prediction['insult']['is_offensive']),
                'probability': float(prediction['insult']['probability'])
            },
            'identity_hate': {
                'is_offensive': bool(prediction['identity_hate']['is_offensive']),
                'probability': float(prediction['identity_hate']['probability'])
            }
        }

        return response
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
    predictions = GEC.CorrectSentence(custom_input)
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

        file_path = os.path.join(UPLOAD_FOLDER, image.filename)
        with open(file_path, "wb") as f:
            f.write(await image.read())

        results = nudity_classifier.detect(file_path)

        exceeded_classes = []

        for result in results:
            detected_class = result["class"]
            score = result["score"]

            if detected_class in class_thresholds and score > class_thresholds[detected_class]:
                exceeded_classes.append(detected_class)

        os.remove(file_path)

        if exceeded_classes:
            return {"result": True, "exceeded_classes": exceeded_classes,"data":results}

        return {"result": False,"data":results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transferStyle")
async def StyleTransfer(request: Request):
    try:
        data = await request.json()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")

    # Ensure input and target are both present and non-empty
    input_text = data.get('input')
    target = data.get('target')

    if not input_text:
        raise HTTPException(status_code=400, detail="Input field is required")

    if not target:
        raise HTTPException(status_code=400, detail="Target is required")

    # Generate styled text
    response = ST.getOutput(input_text, target)
    return response



if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=3007)