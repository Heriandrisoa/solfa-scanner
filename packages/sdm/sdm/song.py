"""Song-level types — Tonalite, Mesure, Partie, SDM."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from sdm.cellule import Cellule


class Tonalite(BaseModel):
    """The header key/tonic.

    ``tonique_midi`` is the MIDI note number that
    ``{ solfa: "d", octave: 0 }`` resolves to — the single source of
    truth every consumer computes pitch from.
    """
    lettre_tonique: Literal["d"] = "d"
    """Always "d" by definition of movable-doh. Carries no information —
    kept only so raw JSON is self-documenting for a human debugging it."""
    tonique_midi: int  # e.g. 70 = Bb4
    affichage: str  # e.g. "Bb", "Db" — exactly as printed on the page


class SignatureRythmique(BaseModel):
    """Time signature (e.g. 4/4, 3/4)."""
    numerateur: int  # beats per measure, e.g. 4
    denominateur: int  # beat unit, e.g. 4 = quarter note

class Ton(BaseModel):
    """One beat worth of content, containing a recursive Cellule."""
    id: str
    cellule: Cellule
    confiance_subdivision: float | None = Field(default=None, ge=0.0, le=1.0)


class Mesure(BaseModel):
    """A measure (bar) containing one or more Tons."""
    id: str
    tons: list[Ton]


Voix = Literal["melodie", "soprano", "alto", "tenor", "basse"]

class Partie(BaseModel):
    """A voice part (melody, soprano, alto, tenor, bass)."""
    id: str
    voix: Voix
    mesures: list[Mesure]


class SDM(BaseModel):
    """Song Data Model — the shared contract between backend and frontend."""
    titre: str | None = None
    tonalite: Tonalite
    signature_rythmique: SignatureRythmique
    tempo_bpm: int | None = Field(default=None,
        description="null = no tempo printed; playback engine applies default.")
    """Exactly 1 entry in single-line mode; up to 4 in multi-part mode."""
    parties: list[Partie]


__all__ = ["Tonalite", "SignatureRythmique", "Ton", "Mesure",
           "Voix", "Partie", "SDM"]
