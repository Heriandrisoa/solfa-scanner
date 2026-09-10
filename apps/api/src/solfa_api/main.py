"""Solfa Scanner — FastAPI backend."""
from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sdm import EXEMPLE_MDC, SDM

app = FastAPI(title="Solfa Scanner API", version="0.1.0")
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware, allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"], allow_headers=["*"],
)


@app.get("/songs", response_model=SDM)
async def get_song() -> SDM:
    """Return an example song as SDM JSON."""
    return EXEMPLE_MDC
