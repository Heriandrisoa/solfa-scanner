"""Nana — longer test song with notes and silences only.

6 measures in 2/4 time, key of Bb (tonique_midi=70), 88 BPM.
Designed to test playback: varied rhythms, rests, ascending/descending motion.
"""
from __future__ import annotations

from sdm.cellule import CelluleNote, CelluleSilence
from sdm.note import Note
from sdm.song import SDM, Mesure, Partie, SignatureRythmique, Ton, Tonalite

NANA: SDM = SDM(
    titre="Nana",
    tonalite=Tonalite(lettre_tonique="d", tonique_midi=70, affichage="Bb"),
    signature_rythmique=SignatureRythmique(numerateur=2, denominateur=4),
    tempo_bpm=88,
    parties=[
        Partie(
            id="partie-1", voix="melodie",
            mesures=[
                # Measure 1: d r (ascending stepwise)
                Mesure(
                    id="mesure-1",
                    tons=[
                        Ton(id="t-1-1", cellule=CelluleNote(
                            note=Note(solfa="d", octave=0, parole="Na"))),
                        Ton(id="t-1-2", cellule=CelluleNote(
                            note=Note(solfa="r", octave=0, parole="na"))),
                    ],
                ),
                # Measure 2: m f (continuing ascent)
                Mesure(
                    id="mesure-2",
                    tons=[
                        Ton(id="t-2-1", cellule=CelluleNote(
                            note=Note(solfa="m", octave=0, parole="so"))),
                        Ton(id="t-2-2", cellule=CelluleNote(
                            note=Note(solfa="f", octave=0, parole="tra"))),
                    ],
                ),
                # Measure 3: s — rest (peak note then silence)
                Mesure(
                    id="mesure-3",
                    tons=[
                        Ton(id="t-3-1", cellule=CelluleNote(
                            note=Note(solfa="s", octave=0, parole="fi"))),
                        Ton(id="t-3-2", cellule=CelluleSilence()),
                    ],
                ),
                # Measure 4: rest — m (silence then descend)
                Mesure(
                    id="mesure-4",
                    tons=[
                        Ton(id="t-4-1", cellule=CelluleSilence()),
                        Ton(id="t-4-2", cellule=CelluleNote(
                            note=Note(solfa="m", octave=0, parole="na"))),
                    ],
                ),
                # Measure 5: r d (descending back to tonic)
                Mesure(
                    id="mesure-5",
                    tons=[
                        Ton(id="t-5-1", cellule=CelluleNote(
                            note=Note(solfa="r", octave=0, parole="na"))),
                        Ton(id="t-5-2", cellule=CelluleNote(
                            note=Note(solfa="d", octave=0, parole="na"))),
                    ],
                ),
                # Measure 6: d — rest (final note, then silence to end)
                Mesure(
                    id="mesure-6",
                    tons=[
                        Ton(id="t-6-1", cellule=CelluleNote(
                            note=Note(solfa="d", octave=0, parole="na"))),
                        Ton(id="t-6-2", cellule=CelluleSilence()),
                    ],
                ),
            ],
        )
    ],
)

__all__ = ["NANA"]
