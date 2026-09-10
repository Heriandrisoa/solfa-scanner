import type { SDM } from "./tones";

const API_BASE = "http://localhost:8000";

export async function fetchSong(): Promise<SDM> {
  const res = await fetch(`${API_BASE}/songs`);
  if (!res.ok) {
    throw new Error(`Failed to fetch song: ${res.status}`);
  }
  return res.json();
}
