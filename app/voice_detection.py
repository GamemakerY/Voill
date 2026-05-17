import os
import time
from dotenv import load_dotenv
from groq import Groq
import pyaudio
import wave
import threading
from app.text_handler import TextHandler


load_dotenv()
groq_api_key = os.getenv("GROQ_API")


class VoiceModel:
    def __init__(self, client, channels=2, rate=44100, chunk=1024, sample_format=pyaudio.paInt16):
        self.channels = channels
        self.rate = rate
        self.chunk = chunk
        self.sample_format = sample_format

        self.client = client
        
        self.is_recording = False
        self.key_combo = {}
        self.frames=[]

        self.thread = threading.Thread(target=self.record)

        self.text_handler = TextHandler(client=self.client)
        
    
    def record(self):
        self.p = pyaudio.PyAudio()
        self.stream = self.p.open(format=self.sample_format,
        channels=self.channels,
        rate=self.rate,
        input=True,
        frames_per_buffer=self.chunk)
        
        print("Recording Started")

        while self.is_recording == True:
            data = self.stream.read(self.chunk)
            self.frames.append(data)
        
        self.stream.stop_stream()
        self.stream.close()
        self.p.terminate()

        print("Recording done")

        self.save_file()
        start_time = time.time()
        self.detect_text()
    
    def save_file(self):
        wf = wave.open("output.wav", 'w')
        wf.setnchannels(self.channels)
        wf.setsampwidth(self.p.get_sample_size(self.sample_format))
        wf.setframerate(self.rate)
        wf.writeframes(b''.join(self.frames))
        wf.close()
        self.frames=[]
    
    def detect_text(self, audio_file='output.wav'):
        self.audio_file = audio_file
        self.time1 = time.time()
        with open(audio_file, "rb") as file:
            transcription = self.client.audio.transcriptions.create(
                file=(audio_file, file.read()),
                model = 'whisper-large-v3-turbo', #removed turbo, temporarily
                temperature=0,
                response_format="verbose_json",
            )
            #language parameter
        print(f"Transcripted text: {transcription.text}")

        self.text_handler.out_text(transcription.text)

        os.remove("output.wav")
    
    def on_press(self):
        try:
            if not self.is_recording:
                print('Key pressed')
                self.is_recording = True
                self.is_active = True
                self.thread = threading.Thread(target=self.record)
                self.thread.start()
        except AttributeError:
            pass

        except Groq.BadRequestError as e:
            pass
    
    def on_release(self):
        self.is_recording = False
        self.is_active = False




    




        

