"""Marche — short example song (original EXEMPLE_MDC)."""
from __future__ import annotations

from sdm.cellule import CelluleDemitemps, CelluleNote
from sdm.note import Note
from sdm.song import SDM, Mesure, Partie, SignatureRythmique, Ton, Tonalite

MARCHE: SDM = SDM(
    titre="Ny Fitiavan'Andriamanitra",
    tonalite=Tonalite(lettre_tonique="d", tonique_midi=70, affichage="Bb"),
    signature_rythmique=SignatureRythmique(numerateur=2, denominateur=4),
    tempo_bpm=88,
    parties=[
        Partie(
            id="partie-1", voix="melodie",
            mesures=[
                Mesure(
                    id="mesure-1",
                    tons=[
                        Ton(id="ton-1", cellule=CelluleDemitemps(
                            premiere=CelluleNote(
                                note=Note(solfa="m", octave=0, parole="Ny")),
                            seconde=CelluleNote(
                                note=Note(solfa="d", octave=0)))),
                        Ton(id="ton-2", cellule=CelluleNote(
                            note=Note(solfa="f", octave=0, parole="fi"))),
                    ],
                )
            ],
        )
    ],
)

__all__ = ["MARCHE"]
