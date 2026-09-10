import { useEffect, useState } from "react";
import { usePlayback } from "./state/usePlayback";
import { PlayControls } from "./components/PlayButton";
import { SolfaNotation } from "./components/SolfaNotation";
import { fetchSong } from "./api/fetchSong";
import type { SDM } from "./api/tones";

export function PlaybackScreen() {
  const [song, setSong] = useState<SDM | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSong()
      .then(setSong)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load song"));
  }, []);

  const { isPlaying, activeBeat, play, stop, restart } = usePlayback(song);
  const toggle = isPlaying ? stop : play;

  if (error) {
    return (
      <section>
        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
          Playback Test
        </h1>
        <p style={{ color: "var(--color-error)" }}>Error: {error}</p>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
          Make sure the API is running on localhost:8000
        </p>
      </section>
    );
  }

  if (!song) {
    return (
      <section>
        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
          Playback Test
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>Loading song...</p>
      </section>
    );
  }

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
          {song.titre} — {song.signature_rythmique.numerateur}/{song.signature_rythmique.denominateur} in {song.tonalite.affichage}, {song.tempo_bpm} BPM
        </p>
      </div>

      <SolfaNotation song={song} activeBeat={activeBeat} />

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
