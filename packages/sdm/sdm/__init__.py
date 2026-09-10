"""Solfa Scanner — Song Data Model (SDM).

Pydantic schemas mirroring the TypeScript types in brouillon_sdm.js.
Both the Python backend (FastAPI) and the React frontend consume
the same JSON shape — this package is the single source of truth
for the data model.
"""
from sdm.cellule import (
                          Cellule,
                          CelluleDemitemps,
                          CelluleNote,
                          CelluleSilence,
                          CelluleTenue,
                          CelluleTierstemps,
)
from sdm.examples import EXEMPLE_MDC
from sdm.fixtures import MARCHE, NANA
from sdm.note import Note
from sdm.notes import DEMI_TONS_PAR_SYLLABE, SyllabeSolfa
from sdm.song import SDM, Mesure, Partie, SignatureRythmique, Ton, Tonalite, Voix

__all__ = [
    # Syllables
    "SyllabeSolfa", "DEMI_TONS_PAR_SYLLABE",
    # Note
    "Note",
    # Cellule
    "Cellule", "CelluleNote", "CelluleSilence", "CelluleTenue",
    "CelluleDemitemps", "CelluleTierstemps",
    # Song
    "Tonalite", "SignatureRythmique", "Ton", "Mesure",
    "Voix", "Partie", "SDM",
    # Example
    "EXEMPLE_MDC",
    # Fixtures
    "MARCHE", "NANA",
]
