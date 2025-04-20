from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import whisper
import tempfile

app = FastAPI()
model = whisper.load_model("base")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=True, suffix=".wav") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp.flush()
        result = model.transcribe(tmp.name)
    return JSONResponse(content={"text": result["text"], "language": result["language"]})
