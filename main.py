import os
from dotenv import load_dotenv
from groq import Groq
from app.voice_detection import VoiceModel
from pynput import keyboard

load_dotenv()
groq_api_key = os.getenv("GROQ_API")

def main():
    client = Groq(
            api_key=groq_api_key
            )  
    
    voice_model = VoiceModel(client)

    voice_model.is_active = False
    with keyboard.Listener(on_press=voice_model.on_press, on_release=voice_model.on_release) as listener:
        print("Listening..")
        listener.join()
    pass

if __name__ == "__main__":
    main()

