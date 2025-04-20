from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Literal
from fastapi.middleware.cors import CORSMiddleware

# LangChain imports
from langchain_community.llms import Ollama
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
import os

app = FastAPI()

# Autoriser CORS pour tests locaux
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class ReplyRequest(BaseModel):
    history: List[Message]
    question: str

class ReplyResponse(BaseModel):
    answer: str

def get_llm():
    # Utilise Ollama/Mistral si dispo, sinon OpenAI
    if os.environ.get("USE_OPENAI", "0") == "1":
        return ChatOpenAI()
    return Ollama(model="mistral")

def history_to_langchain(history: List[Message]):
    # Convertit l’historique au format LangChain
    role_map = {
        "user": HumanMessage,
        "assistant": AIMessage,
        "system": SystemMessage,
    }
    return [role_map[m.role](content=m.content) for m in history]

@app.post("/reply", response_model=ReplyResponse)
async def reply(req: ReplyRequest):
    llm = get_llm()
    messages = history_to_langchain(req.history)
    messages.append(HumanMessage(content=req.question))
    # Prompt simple, peut être adapté
    answer = llm.invoke(messages)
    if isinstance(answer, str):
        return {"answer": answer}
    # Si le LLM retourne un message structuré
    return {"answer": getattr(answer, "content", str(answer))}
