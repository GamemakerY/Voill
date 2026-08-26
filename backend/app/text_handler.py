import sys
import os


class TextHandler:
    def __init__(self, client):
        self.client = client 
        print("Model initialized")

        if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'): #for pyinstaller
            base_path = sys._MEIPASS
        else:
            base_path = os.path.abspath(".")

        prompt_path = os.path.join(base_path, "prompts", "v5.txt")

        with open(prompt_path, 'r', encoding='utf-8') as file:
            self.system_prompt = file.read()

    def out_text(self, text: str) -> str:
        self.text = f"Please edit this transcript according to your system instructions:\n\n<transcript>\n{text}\n</transcript>"

        print("Starting...")
        self.completion = self.client.chat.completions.create(
            model = "openai/gpt-oss-20b", #Originally llama-3.1-8b-instant, then llama-3.3-70b-versatile, both got removed by Groq now
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
