from app.voice_detection import VoiceModel
from pynput import keyboard
from app.client import Client

def main():
    client = Client().client #Might be a better way to do this, pending
    
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

2. (FIxed) The key combo detection isn't working that well, perhaps the on_remove isn't removing the key properly or holding the key has unintended effects. (Fixed)

PLAN:
1. Figure out if possible as an input device or an app simply paste clipboard (Paste clipboard implemented)
2. Make a frontend for this
3. See if it can have better multi-lingual support
'''