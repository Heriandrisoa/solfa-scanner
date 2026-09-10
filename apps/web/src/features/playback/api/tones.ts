/**
 * SDM types + pitch conversion for Tone.js playback.
 *
 * Minimal type definitions matching the Python SDM schema.
 * In the future, these should be auto-generated from the Pydantic models.
 */
export interface Note {
  solfa: string;
  octave: number;
  parole?: string;
}

export interface CelluleNote {
  genre: "note";
  note: Note;
}

export interface CelluleSilence {
  genre: "silence";
}

export type Cellule = CelluleNote | CelluleSilence;

export interface Ton {
  id: string;
  cellule: Cellule;
}

export interface Mesure {
  id: string;
  tons: Ton[];
}

export interface Tonalite {
  lettre_tonique: string;
  tonique_midi: number;
  affichage: string;
}

export interface SignatureRythmique {
  numerateur: number;
  denominateur: number;
}

export interface Partie {
  id: string;
  voix: string;
  mesures: Mesure[];
}

export interface SDM {
  titre: string;
  tonalite: Tonalite;
  signature_rythmique: SignatureRythmique;
  tempo_bpm: number;
  parties: Partie[];
}

/**
 * Solfa syllable → semitone offset from tonic.
 * Matches packages/sdm/sdm/notes.py DEMI_TONS_PAR_SYLLABE.
 */
const DEMI_TONS: Record<string, number> = {
  d: 0, de: 1, r: 2, ra: 1, re: 3,
  m: 4, ma: 3, f: 5, fe: 6,
  s: 7, se: 8, l: 9, la: 8, le: 10,
  t: 11, ta: 10,
};

/**
 * Convert an SDM Note to a MIDI note number.
 *
 * Formula: tonique_midi + DEMI_TONS[solfa] + octave * 12
 */
export function noteToMidi(note: Note, toniqueMidi: number): number {
  const offset = DEMI_TONS[note.solfa] ?? 0;
  return toniqueMidi + offset + note.octave * 12;
}

/**
 * Convert MIDI note number to Tone.js note string (e.g. "Bb4", "C5").
 */
function midiToNoteName(midi: number): string {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(midi / 12) - 1;
  const name = names[midi % 12];
  return `${name}${octave}`;
}

/**
 * Convert an SDM Note to a Tone.js-compatible note string.
 */
export function noteToTone(note: Note, toniqueMidi: number): string {
  return midiToNoteName(noteToMidi(note, toniqueMidi));
}
