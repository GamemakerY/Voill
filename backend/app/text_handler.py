from groq import Groq
from pathlib import Path
from pynput.keyboard import Controller


class TextHandler:
    def __init__(self, client):
        self.client = client 
        print("Model initialized")

        with open("prompts/v5.txt", 'r') as file:
            self.system_prompt = file.read()

    def out_text(self, text: str) -> str:
        self.text = f"Please edit this transcript according to your system instructions:\n\n<transcript>\n{text}\n</transcript>"

        print("Starting...")
        self.completion = self.client.chat.completions.create(
            model = "llama-3.3-70b-versatile", #Originally llama-3.1-8b-instant
            messages=[
                {
                    "role":"system",
                    "content": self.system_prompt
                },
                {
                    "role":"user",
                    "content": self.text
                }
            ],
            temperature=0,
            max_completion_tokens=4000,
        )

        print("Done")

        return (self.completion.choices[0].message.content)
