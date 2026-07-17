from groq import Groq
#from dotenv import load_dotenv
import os

class Client:
    def __init__(self, groq_api_key):
        #load_dotenv()
        #groq_api_key = os.getenv("GROQ_API")
        self.client = Groq(
            api_key=groq_api_key
            )