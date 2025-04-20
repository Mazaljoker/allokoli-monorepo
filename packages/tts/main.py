import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech"

# Par défaut : voix francophone (par exemple "TxGEqnHWrfWFTfGW9XjX" = voix française par défaut chez ElevenLabs)
DEFAULT_FR_VOICE_ID = "TxGEqnHWrfWFTfGW9XjX"

class SpeakRequest(BaseModel):
    text: str
    langue: str
    voice_id: Optional[str] = None

app = FastAPI()

@app.post("/speak")
def speak(req: SpeakRequest):
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY not set")

    voice_id = req.voice_id or DEFAULT_FR_VOICE_ID
    url = f"{ELEVENLABS_API_URL}/{voice_id}"

    payload = {
        "text": req.text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers, stream=True)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"ElevenLabs API error: {response.text}")

    return StreamingResponse(
        response.iter_content(chunk_size=4096),
        media_type="audio/mpeg"
    )
