from app import text_handler
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from app.voice_detection import VoiceModel
from app.client import Client
from app.text_handler import TextHandler
from pynput import keyboard
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

@app.post("/audios")
def process_audio(file: UploadFile = File(...)) -> str: 
    final_text = ''
    try:
        start_time = time.time()
        file_bytes = file.file.read() 
        file_obj = (file.filename, file_bytes)
        transcripted_text = voice_model.detect_text(file_obj)
        final_text = texthandler.out_text(transcripted_text)
        end_time = time.time()
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise e
    #Remove file, after processing
    return (f"{final_text}, time: {(end_time - start_time)}")

def main():
    voice_model.is_active = False

    key_combo = {keyboard.KeyCode.from_char('r'),keyboard.Key.alt_l}
    current_keys = set()

    def on_press(key):
        if key in key_combo:
            current_keys.add(key)
        if current_keys.issuperset(key_combo):
            voice_model.on_press()

    def on_release(key):
        if key in key_combo:
            current_keys.remove(key)
            voice_model.on_release()

    with keyboard.Listener(on_press=on_press,on_release=on_release) as listener:
        listener.join()
    pass

if __name__ == "__main__":
    main()

'''
BUGS:
1. Might still be 'remembering' previous recordings (It was working but I think I broke it again)

2. (FIxed) The key combo detection isn't working that well, perhaps the on_remove isn't removing the key properly or holding the key has unintended effects.

PLAN:
1. (Paste clipboard implemented, nvm)Figure out if possible as an input device or an app simply paste clipboard 
2. Make a frontend for this
3. See if it can have better multi-lingual support
'''