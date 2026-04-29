import os
from dotenv import load_dotenv
from groq import Groq
import pyaudio
import wave
import threading


load_dotenv()
groq_api_key = os.getenv("GROQ_API")


class VoiceModel:
    def __init__(self, api_key='', channels=2, rate=44100, chunk=1024, sample_format=pyaudio.paInt16):
        self.channels = channels
        self.rate = rate
        self.chunk = chunk
        self.sample_format = sample_format

        self.client = Groq(
            api_key=api_key
            )  
        
        self.is_recording = False
        self.frames=[]

        self.thread = threading.Thread(target=self.record)
    
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
        
        with open(audio_file, "rb") as file:
            transcription = self.client.audio.transcriptions.create(
                file=(audio_file, file.read()),
                model = 'whisper-large-v3-turbo',
                temperature=0,
                language='en',
                response_format="verbose_json",
            )
        print(transcription.text)
        os.remove("output.wav")
    
    def on_press(self, key):
        try:
            if key.char == 'r' and not self.is_recording:
                print('Key pressed')
                self.is_recording = True
                self.is_active = True
                self.thread = threading.Thread(target=self.record)
                self.thread.start()
        except AttributeError:
            pass
    
    def on_release(self, key):
        try:
            if key.char=='r':
                self.is_recording = False
                self.is_active = False
        except AttributeError:
            pass



    




        

