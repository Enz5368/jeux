import type { CharacterId } from '../types';
export interface BestTime { trackId: string; characterId: CharacterId; time: number; date: string; }
const KEY = 'orellana-racing.best-times.v1';
export class BestTimes {
  constructor(private readonly storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage) {}
  all(): BestTime[] { try { const parsed = JSON.parse(this.storage.getItem(KEY) ?? '[]') as unknown; return Array.isArray(parsed) ? parsed as BestTime[] : []; } catch { return []; } }
  save(trackId: string, characterId: CharacterId, time: number): boolean { const times = this.all(); const old = times.find((t) => t.trackId === trackId && t.characterId === characterId); if (old && old.time <= time) return false; const next = times.filter((t) => t !== old); next.push({ trackId, characterId, time, date: new Date().toISOString() }); this.storage.setItem(KEY, JSON.stringify(next)); return true; }
}
