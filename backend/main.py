
from fastapi import FastAPI
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from RagEngine import GRAPHRAGEngine
from starlette.middleware.cors import CORSMiddleware
import uvicorn
import deps

from routers import query, upload

load_dotenv()



@asynccontextmanager
async def lifespan(app: FastAPI):
    global rag_service
    deps.rag_service = GRAPHRAGEngine()
    yield
    if rag_service:
        rag_service.close()


app = FastAPI(
    title="GraphRAG API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(query.router)
app.include_router(upload.router)





