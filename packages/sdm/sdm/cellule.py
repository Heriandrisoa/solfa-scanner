"""Cellule — what one beat contains, recursively."""
from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, Field

from sdm.note import Note


class CelluleNote(BaseModel):
    """A single note within a beat."""

    genre: Literal["note"] = "note"
    note: Note

class CelluleSilence(BaseModel):
    """A rest."""
    genre: Literal["silence"] = "silence"

class CelluleTenue(BaseModel):
    """A held note (barre / dash)."""
    genre: Literal["tenue"] = "tenue"

class CelluleDemitemps(BaseModel):
    """Two notes in one beat (e.g. d.m)."""

    genre: Literal["demiTemps"] = "demiTemps"
    premiere: Cellule = Field(..., description="First note of the pair.")
    seconde: Cellule

class CelluleTierstemps(BaseModel):
    """Three notes in one beat (e.g. d.,m)."""

    genre: Literal["tiersTemps"] = "tiersTemps"
    premiere: Cellule = Field(..., description="First note of the triplet.")
    seconde: Cellule

Cellule = Annotated[
    CelluleNote | CelluleSilence | CelluleTenue | CelluleDemitemps | CelluleTierstemps,
    Field(discriminator="genre"),
]

__all__ = [
    "Cellule",
    "CelluleNote",
    "CelluleSilence",
    "CelluleTenue",
    "CelluleDemitemps",
    "CelluleTierstemps",
]
