import { usePlayback } from "./state/usePlayback";
import { PlayControls } from "./components/PlayButton";
import { SolfaNotation } from "./components/SolfaNotation";
import type { SDM } from "./api/tones";

/**
 * Hardcoded test song — Nana, 6 measures in Bb, 2/4 time, 88 BPM.
 * Matches packages/sdm/sdm/fixtures/nana.py.
 */
const NANA: SDM = {
  titre: "Nana",
  tonalite: { lettre_tonique: "d", tonique_midi: 70, affichage: "Bb" },
  signature_rythmique: { numerateur: 2, denominateur: 4 },
  tempo_bpm: 88,
  parties: [
    {
      id: "partie-1",
      voix: "melodie",
      mesures: [
        {
          id: "mesure-1",
          tons: [
            { id: "t-1-1", cellule: { genre: "note", note: { solfa: "d", octave: 0 } } },
            { id: "t-1-2", cellule: { genre: "note", note: { solfa: "r", octave: 0 } } },
          ],
        },
        {
          id: "mesure-2",
          tons: [
            { id: "t-2-1", cellule: { genre: "note", note: { solfa: "m", octave: 0 } } },
            { id: "t-2-2", cellule: { genre: "note", note: { solfa: "f", octave: 0 } } },
          ],
        },
        {
          id: "mesure-3",
          tons: [
            { id: "t-3-1", cellule: { genre: "note", note: { solfa: "s", octave: 0 } } },
            { id: "t-3-2", cellule: { genre: "silence" } },
          ],
        },
        {
          id: "mesure-4",
          tons: [
            { id: "t-4-1", cellule: { genre: "silence" } },
            { id: "t-4-2", cellule: { genre: "note", note: { solfa: "m", octave: 0 } } },
          ],
        },
        {
          id: "mesure-5",
          tons: [
            { id: "t-5-1", cellule: { genre: "note", note: { solfa: "r", octave: 0 } } },
            { id: "t-5-2", cellule: { genre: "note", note: { solfa: "d", octave: 0 } } },
          ],
        },
        {
          id: "mesure-6",
          tons: [
            { id: "t-6-1", cellule: { genre: "note", note: { solfa: "d", octave: 0 } } },
            { id: "t-6-2", cellule: { genre: "silence" } },
          ],
        },
      ],
    },
  ],
};

export function PlaybackScreen() {
  const { isPlaying, activeBeat, play, stop, restart } = usePlayback(NANA);
  const toggle = isPlaying ? stop : play;

  return (
    <section>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: "var(--space-2)",
          }}
        >
          Playback Test
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          {NANA.titre} — {NANA.signature_rythmique.numerateur}/{NANA.signature_rythmique.denominateur} in {NANA.tonalite.affichage}, {NANA.tempo_bpm} BPM
        </p>
      </div>

      <SolfaNotation song={NANA} activeBeat={activeBeat} />

      <div style={{ marginTop: "var(--space-6)" }}>
        <PlayControls isPlaying={isPlaying} onToggle={toggle} onRestart={restart} />
      </div>

      {isPlaying && (
        <p
          style={{
            marginTop: "var(--space-4)",
            fontSize: "var(--text-sm)",
            color: "var(--color-primary)",
          }}
        >
          Playing...
        </p>
      )}
    </section>
  );
}
