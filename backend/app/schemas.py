from Pydantic import BaseModel

class AudioParse(BaseModel):
    id: int
    file: str #file_type