import type { SDM } from "../api/tones";
import styles from "./SolfaNotation.module.css";

interface SolfaNotationProps {
  song: SDM;
  activeBeat: number | null;
}

function formatSolfa(solfa: string): string {
  return solfa.toUpperCase();
}

function formatOctave(octave: number): string {
  if (octave === 0) return "";
  if (octave > 0) return "'".repeat(octave);
  return ",".repeat(Math.abs(octave));
}

export function SolfaNotation({ song, activeBeat }: SolfaNotationProps) {
  let globalBeat = 0;

  return (
    <div className={styles.staff}>
      <div className={styles.header}>
        <div className={styles.headerItem}>
          <span className={styles.headerLabel}>Title</span>
          <span>{song.titre}</span>
        </div>
        <div className={styles.headerItem}>
          <span className={styles.headerLabel}>Key</span>
          <span>{song.tonalite.affichage}</span>
        </div>
        <div className={styles.headerItem}>
          <span className={styles.headerLabel}>Time</span>
          <span>{song.signature_rythmique.numerateur}/{song.signature_rythmique.denominateur}</span>
        </div>
        <div className={styles.headerItem}>
          <span className={styles.headerLabel}>Tempo</span>
          <span>{song.tempo_bpm} BPM</span>
        </div>
      </div>

      <div className={styles.measures}>
        {song.parties.flatMap((partie) =>
          partie.mesures.map((mesure, mIdx) => {
            const beats = mesure.tons.map((ton) => {
              const beatIndex = globalBeat++;
              const isActive = activeBeat === beatIndex;
              const cellule = ton.cellule;

              if (cellule.genre === "silence") {
                return (
                  <div
                    key={ton.id}
                    className={`${styles.beat} ${styles.rest} ${isActive ? styles.beatActive : ""}`}
                  >
                    <span className={styles.solfa}>—</span>
                    <span className={styles.octave}>&nbsp;</span>
                  </div>
                );
              }

              const { note } = cellule;
              return (
                <div
                  key={ton.id}
                  className={`${styles.beat} ${isActive ? styles.beatActive : ""}`}
                >
                  <span className={styles.solfa}>{formatSolfa(note.solfa)}</span>
                  <span className={styles.octave}>{formatOctave(note.octave)}</span>
                  {note.parole && (
                    <span className={styles.lyric}>{note.parole}</span>
                  )}
                </div>
              );
            });

            return (
              <div key={mesure.id} className={styles.measure}>
                {mIdx > 0 && (
                  <div className={styles.barline}>
                    <div className={styles.barlineLine} />
                  </div>
                )}
                {beats}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
