"""Jingle Bells — chorus, 16 measures in 2/4, key of Bb.

Melody only, note + silence cells. 32 beats total.
Sol-fa in Bb major: d=Bb, r=C, m=D, f=Eb, s=F, l=G, t=A.

Chorus (in C major): E E E- | E E E- | E G C D | E--- |
F F F- | F E E- | E D D F | D-G- |
E E E- | E E E- | E G C D | E--- |
F F F- | F E E- | G G E D | C--- |
"""
from __future__ import annotations

from sdm.cellule import CelluleNote, CelluleSilence
from sdm.note import Note
from sdm.song import SDM, Mesure, Partie, SignatureRythmique, Ton, Tonalite

NANA: SDM = SDM(
    titre="Jingle Bells",
    tonalite=Tonalite(lettre_tonique="d", tonique_midi=70, affichage="Bb"),
    signature_rythmique=SignatureRythmique(numerateur=2, denominateur=4),
    tempo_bpm=120,
    parties=[
        Partie(
            id="partie-1", voix="melodie",
            mesures=[
                # --- "Jingle bells, jingle bells" ---
                Mesure(id="mesure-1", tons=[
                    Ton(id="t-1-1", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="Jin"))),
                    Ton(id="t-1-2", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="gle"))),
                ]),
                Mesure(id="mesure-2", tons=[
                    Ton(id="t-2-1", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="bells"))),
                    Ton(id="t-2-2", cellule=CelluleSilence()),
                ]),
                Mesure(id="mesure-3", tons=[
                    Ton(id="t-3-1", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="Jin"))),
                    Ton(id="t-3-2", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="gle"))),
                ]),
                Mesure(id="mesure-4", tons=[
                    Ton(id="t-4-1", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="bells"))),
                    Ton(id="t-4-2", cellule=CelluleSilence()),
                ]),
                # --- "Jingle all the way" ---
                Mesure(id="mesure-5", tons=[
                    Ton(id="t-5-1", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="Jin"))),
                    Ton(id="t-5-2", cellule=CelluleNote(
                        note=Note(solfa="s", octave=0, parole="gle"))),
                ]),
                Mesure(id="mesure-6", tons=[
                    Ton(id="t-6-1", cellule=CelluleNote(
                        note=Note(solfa="d", octave=1, parole="all"))),
                    Ton(id="t-6-2", cellule=CelluleNote(
                        note=Note(solfa="r", octave=0, parole="the"))),
                ]),
                Mesure(id="mesure-7", tons=[
                    Ton(id="t-7-1", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="way"))),
                    Ton(id="t-7-2", cellule=CelluleSilence()),
                ]),
                Mesure(id="mesure-8", tons=[
                    Ton(id="t-8-1", cellule=CelluleSilence()),
                    Ton(id="t-8-2", cellule=CelluleSilence()),
                ]),
                # --- "Oh what fun it is to ride" ---
                Mesure(id="mesure-9", tons=[
                    Ton(id="t-9-1", cellule=CelluleNote(
                        note=Note(solfa="f", octave=0, parole="Oh"))),
                    Ton(id="t-9-2", cellule=CelluleNote(
                        note=Note(solfa="f", octave=0, parole="what"))),
                ]),
                Mesure(id="mesure-10", tons=[
                    Ton(id="t-10-1", cellule=CelluleNote(
                        note=Note(solfa="f", octave=0, parole="fun"))),
                    Ton(id="t-10-2", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="it"))),
                ]),
                Mesure(id="mesure-11", tons=[
                    Ton(id="t-11-1", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="is"))),
                    Ton(id="t-11-2", cellule=CelluleNote(
                        note=Note(solfa="m", octave=0, parole="to"))),
                ]),
                Mesure(id="mesure-12", tons=[
                    Ton(id="t-12-1", cellule=CelluleNote(
                        note=Note(solfa="r", octave=0, parole="ride"))),
                    Ton(id="t-12-2", cellule=CelluleSilence()),
                ]),
                # --- "In a one-horse open sleigh" ---
                Mesure(id="mesure-13", tons=[
                    Ton(id="t-13-1", cellule=CelluleNote(
                        note=Note(solfa="r", octave=0, parole="In"))),
                    Ton(id="t-13-2", cellule=CelluleNote(
                        note=Note(solfa="r", octave=0, parole="a"))),
                ]),
                Mesure(id="mesure-14", tons=[
                    Ton(id="t-14-1", cellule=CelluleNote(
                        note=Note(solfa="f", octave=0, parole="one"))),
                    Ton(id="t-14-2", cellule=CelluleNote(
                        note=Note(solfa="r", octave=0, parole="horse"))),
                ]),
                Mesure(id="mesure-15", tons=[
                    Ton(id="t-15-1", cellule=CelluleNote(
                        note=Note(solfa="s", octave=0))),
                    Ton(id="t-15-2", cellule=CelluleSilence()),
                ]),
                Mesure(id="mesure-16", tons=[
                    Ton(id="t-16-1", cellule=CelluleNote(
                        note=Note(solfa="d", octave=0, parole="sleigh"))),
                    Ton(id="t-16-2", cellule=CelluleSilence()),
                ]),
            ],
        )
    ],
)

__all__ = ["NANA"]
