"""Pitch content — what a note actually is."""

from __future__ import annotations

from pydantic import BaseModel, Field

from sdm.notes import SyllabeSolfa


class Note(BaseModel):
    """A single solfa note with its octave and optional lyrics."""

    solfa: SyllabeSolfa
    octave: int
    parole: str | None = None
    confiance: float | None = Field(
        default=None,
        ge=0.0,
        le=1.0,
        description="0-1 OCR confidence for this note's pitch specifically.",
    )


__all__ = ["Note"]
