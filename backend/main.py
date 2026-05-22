from app import text_handler
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from app.voice_detection import VoiceModel
from app.client import Client
from app.text_handler import TextHandler

app = FastAPI()
client = Client().client
voice_model = VoiceModel(client)
texthandler = TextHandler(client)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #Later
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/audios/{item_id}")
def process_audio(file: UploadFile) -> str: 
    transcripted_text = voice_model.detect_text(file)
    final_text = texthandler.out_text(transcripted_text)
    #Remove file, after processing
    return final_text