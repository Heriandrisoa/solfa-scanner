export type SyllabeSolfa =
  | "d" | "de"
  | "r" | "ra" | "re"
  | "m" | "ma"
  | "f" | "fe"
  | "s" | "se"
  | "l" | "la" | "le"
  | "t" | "ta";

export const DEMI_TONS_PAR_SYLLABE: Readonly<Record<SyllabeSolfa, number>> = {
  d: 0,  de: 1,
  r: 2,  ra: 1,  re: 3,
  m: 4,  ma: 3,
  f: 5,  fe: 6,
  s: 7,  se: 8,
  l: 9,  la: 8,  le: 10,
  t: 11, ta: 10,
};

/** The header key/tonic. `toniqueMidi` is the MIDI note number that
 *  { solfa: "d", octave: 0 } resolves to — the single source of
 *  truth every consumer computes pitch from. */
export interface Tonalite {
  /** Always "d" by definition of movable-doh. Carries no information —
   *  kept only so raw JSON is self-documenting for a human debugging it. */
  lettreTonique: "d";
  toniqueMidi: number;    // e.g. 70 = Bb4
  affichage: string;      // e.g. "Bb", "Db" — exactly as printed on the page
}

// ----------------------------------------------------------------------
// Time
// ----------------------------------------------------------------------

export interface SignatureRythmique {
  numerateur: number;    // beats per measure, e.g. 4
  denominateur: number;  // beat unit, e.g. 4 = quarter note
}

export interface Note {
  solfa: SyllabeSolfa;
  octave: number; // the octave of the note
  parole: string | null;
  /** 0-1 OCR confidence for this note's pitch specifically. */
  confiance?: number;
}

// ----------------------------------------------------------------------
// Cellule  what one Ton contains, recursively
// ----------------------------------------------------------------------
export type Cellule =
  | { genre: "note"; note: Note }
  | { genre: "silence" }
  | { genre: "tenue" }   // barre (-)
  | { genre: "demiTemps"; premiere: Cellule; seconde: Cellule } // (ex: d.m)
  | { genre: "tiersTemps"; premiere: Cellule; seconde: Cellule}; // (ex : d.,m)

export interface Ton {
  id: string;
  cellule: Cellule;
  confianceSubdivision?: number;
}

export interface Mesure {
  id: string;
  tons: Ton[];
}

/** "melodie" exists so single-line mode doesn't have to lie and call an
 *  arbitrary line "soprano." */
export type Voix = "melodie" | "soprano" | "alto" | "tenor" | "basse";

export interface Partie {
  id: string;
  voix: Voix;
  mesures: Mesure[];
}

// ----------------------------------------------------------------------
// Top level
// ----------------------------------------------------------------------

export interface SDM { // song data model
  titre: string | null;
  tonalite: Tonalite;
  signatureRythmique: SignatureRythmique;
  /** null = no tempo printed on the page; the playback engine applies a
   *  default rather than the schema fabricating one. */
  tempoBpm: number | null;
  /** Exactly 1 entry in single-line mode; up to 4 in multi-part mode. */
  parties: Partie[];
}


export const EXEMPLE_MDC: SDM = {
  titre: "Ny Fitiavan'Andriamanitra",
  tonalite: { lettreTonique: "d", toniqueMidi: 70, affichage: "Bb" },
  signatureRythmique: { numerateur: 2, denominateur: 4 },
  tempoBpm: 88,
  parties: [
    {
      id: "partie-1",
      voix: "melodie",
      mesures: [
        {
          id: "mesure-1",
          tons: [
            {
              id: "ton-1",
              cellule: {
                genre: "demiTemps",
                premiere: { genre: "note", note: { solfa: "m", octave: 0, parole: "Ny" } },
                seconde: { genre: "note", note: { solfa: "d", octave: 0, parole: null } },
              },
            },
            {
              id: "ton-2",
              cellule: { genre: "note", note: { solfa: "f", octave: 0, parole: "fi" } },
            },
          ],
        },
      ],
    },
  ],
};