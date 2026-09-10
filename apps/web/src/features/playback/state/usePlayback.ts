import { useCallback, useRef, useState } from "react";
import * as Tone from "tone";
import type { SDM } from "../api/tones";
import { noteToTone } from "../api/tones";

interface UsePlaybackReturn {
  isPlaying: boolean;
  play: () => void;
  stop: () => void;
  restart: () => void;
}

function buildEvents(song: SDM) {
  const events: [number, { freq: string; dur: string } | null][] = [];
  const { denominateur } = song.signature_rythmique;
  const beatDuration = `${denominateur}n`;

  let beatIndex = 0;

  for (const partie of song.parties) {
    for (const mesure of partie.mesures) {
      for (const ton of mesure.tons) {
        const time = beatIndex * Tone.Time(beatDuration).toSeconds();

        if (ton.cellule.genre === "note") {
          const freq = noteToTone(ton.cellule.note, song.tonalite.tonique_midi);
          events.push([time, { freq, dur: beatDuration }]);
        } else {
          events.push([time, null]);
        }
        beatIndex++;
      }
    }
  }

  return events;
}

export function usePlayback(song: SDM): UsePlaybackReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.Synth | null>(null);
  const partRef = useRef<Tone.Part | null>(null);

  const cleanup = useCallback(() => {
    partRef.current?.dispose();
    partRef.current = null;
    synthRef.current?.dispose();
    synthRef.current = null;
    Tone.Transport.position = 0;
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    partRef.current?.stop();
    cleanup();
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }, [cleanup]);

  const startPlayback = useCallback(() => {
    void Tone.start();

    const synth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.3 },
    }).toDestination();

    synthRef.current = synth;

    Tone.Transport.bpm.value = song.tempo_bpm;
    Tone.Transport.timeSignature = [
      song.signature_rythmique.numerateur,
      song.signature_rythmique.denominateur,
    ];

    const events = buildEvents(song);
    const part = new Tone.Part((time, value) => {
      if (value) {
        synth.triggerAttackRelease(value.freq, value.dur, time);
      }
    }, events);

    // Auto-stop after last event
    const lastBeat = events.length;
    const { denominateur } = song.signature_rythmique;
    const totalSeconds = lastBeat * Tone.Time(`${denominateur}n`).toSeconds();
    Tone.Transport.schedule(() => {
      cleanup();
    }, totalSeconds + 0.1);

    partRef.current = part;
    part.start(0);
    Tone.Transport.start("+0.05");
    setIsPlaying(true);
  }, [song, cleanup]);

  const play = useCallback(() => {
    if (isPlaying) {
      stop();
      return;
    }
    startPlayback();
  }, [isPlaying, stop, startPlayback]);

  const restart = useCallback(() => {
    if (isPlaying) {
      stop();
    }
    startPlayback();
  }, [isPlaying, stop, startPlayback]);

  return { isPlaying, play, stop, restart };
}
