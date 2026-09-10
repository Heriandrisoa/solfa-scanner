"""Solfa syllables and pitch helpers."""

from __future__ import annotations

from typing import Literal

SyllabeSolfa = Literal[
    "d",
    "de",
    "r",
    "ra",
    "re",
    "m",
    "ma",
    "f",
    "fe",
    "s",
    "se",
    "l",
    "la",
    "le",
    "t",
    "ta",
]

DEMI_TONS_PAR_SYLLABE: dict[SyllabeSolfa, int] = {
    "d": 0,
    "de": 1,
    "r": 2,
    "ra": 1,
    "re": 3,
    "m": 4,
    "ma": 3,
    "f": 5,
    "fe": 6,
    "s": 7,
    "se": 8,
    "l": 9,
    "la": 8,
    "le": 10,
    "t": 11,
    "ta": 10,
}

__all__ = ["SyllabeSolfa", "DEMI_TONS_PAR_SYLLABE"]
