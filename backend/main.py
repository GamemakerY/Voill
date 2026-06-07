import asyncio
from groq import PermissionDeniedError
from app import text_handler
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from app.voice_detection import VoiceModel
from app.client import Client
from app.text_handler import TextHandler
import time

app = FastAPI()
client = Client().client  
voice_model = VoiceModel(client)
texthandler = TextHandler(client)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #Later
    allow_credentials=False,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.post("/audios", response_class=PlainTextResponse)
async def process_audio(file: UploadFile = File(...), max_retries=3) -> str: 
    final_text = ''
    for attempt in range(max_retries):
        try:
            start_time = time.time()

            #file_obj = (file.filename, file_bytes)

            transcripted_text = await voice_model.detect_text(file) #MOst time
            end_time_1 = time.time()

            final_text = texthandler.out_text(transcripted_text)

            end_time_2 = time.time()

            print(f"Time 1: {end_time_1-start_time}, Time 2: {end_time_2-end_time_1}")
            end_time = time.time()
            print(end_time-start_time)

            return(final_text)

        except PermissionDeniedError as e:
            if "403" in str(e) and attempt < max_retries - 1:
                await file.seek(0)
                await asyncio.sleep(1)
                continue
            raise e
    #Remove file, after processing
    return (final_text)

'''
BUGS:
1. Might still be 'remembering' previous recordings (It was working but I think I broke it again)

2. (FIxed) The key combo detection isn't working that well, perhaps the on_remove isn't removing the key properly or holding the key has unintended effects.

PLAN:
1. (Paste clipboard implemented)Figure out if possible as an input device or an app simply paste clipboard 
2. (Done) Make a frontend for this
3. See if it can have better multi-lingual support
'''