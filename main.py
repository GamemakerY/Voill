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
            print(f"Key removed: {key}")
            voice_model.on_release()

    with keyboard.Listener(on_press=on_press,on_release=on_release) as listener:
        listener.join()
    pass


    '''
    with keyboard.Listener(on_press=voice_model.on_press, on_release=voice_model.on_release) as listener:
        print("Listening..")
        listener.join()
    pass
    '''
if __name__ == "__main__":
    main()

'''
BUGS:
1. Might still be 'remembering' previous recordings (It was working but I think I broke it again)

2. The key combo detection isn't working that well, perhaps the on_remove isn't removing the key properly or holding the key has unintended effects.'''