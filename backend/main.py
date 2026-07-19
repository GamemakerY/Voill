from groq import APIConnectionError
from groq import AuthenticationError
import uvicorn
import asyncio
from groq import PermissionDeniedError
from fastapi import FastAPI, File, UploadFile, Depends
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from app.voice_detection import VoiceModel
from app.client import Client
from app.text_handler import TextHandler
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #Later
    allow_credentials=False,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
header_scheme = APIKeyHeader(name="APIKey", auto_error=False)

@app.post("/audios", response_class=PlainTextResponse)
async def process_audio(api_key:str | None = Depends(header_scheme), file: UploadFile = File(...), max_retries=3) -> str: 

    #Validate API Key first
    client = Client(groq_api_key=api_key).client 
    voice_model: VoiceModel = VoiceModel(client=client)
    texthandler: TextHandler = TextHandler(client=client) 
    
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

@app.post("/testAPIKey")
async def test_api_key(api_key: str = Depends(header_scheme)) -> bool:
    try:
        client = Client(groq_api_key=api_key).client 
        client.models.list()

        return True
    
    except AuthenticationError:
        return False
    
    except APIConnectionError:
        return False
    
    except Exception:
        return False



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")

'''
BUGS:
1. Might still be 'remembering' previous recordings (It was working but I think I broke it again)

2. (FIxed) The key combo detection isn't working that well, perhaps the on_remove isn't removing the key properly or holding the key has unintended effects.

PLAN:
1. (Paste clipboard implemented)Figure out if possible as an input device or an app simply paste clipboard 
2. (Done) Make a frontend for this
3. See if it can have better multi-lingual support
'''