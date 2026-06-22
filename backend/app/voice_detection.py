from logging import exception
from app.client import Client
import pyaudio
import wave
import threading
from app.text_handler import TextHandler
from fastapi import UploadFile


class VoiceModel:
    def __init__(self, client, channels=2, rate=44100, chunk=1024, sample_format=pyaudio.paInt16):
        #Remove record, save_file etc. from here, either separate or entirely remove after front-end
        self.channels = channels
        self.rate = rate
        self.chunk = chunk
        self.sample_format = sample_format

        self.client = client
        
        self.is_recording = False
        self.key_combo = {}
        self.frames=[]

        self.text_handler = TextHandler(client=self.client)
    

    
    async def detect_text(self, audio_file: UploadFile) -> str:

        #audio_bytes = await audio_file.read()
        file_bytes = await audio_file.read()
        file_obj = (audio_file.filename, file_bytes)
        transcription = self.client.audio.transcriptions.create(
            file=file_obj,
            model = 'whisper-large-v3-turbo', #originally different
            temperature=0,
            response_format="verbose_json",
            )
            #language parameter
        print(f"Transcripted text: {transcription.text}")

        return transcription.text



    




        

