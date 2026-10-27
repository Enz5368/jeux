export type RacePhase = 'countdown' | 'racing' | 'finished' | 'paused';
export interface RaceSnapshot { phase: RacePhase; lap: number; totalLaps: number; elapsed: number; lapElapsed: number; bestLap: number | null; countdown: number; progress: number; }
export class RaceManager {
  phase: RacePhase = 'countdown'; lap = 1; elapsed = 0; lapStartedAt = 0; bestLap: number | null = null; readonly lapTimes: number[] = []; nextCheckpoint = 0; countdown = 3.9; private previousPhase: RacePhase = 'racing';
  constructor(readonly checkpointCount: number, readonly totalLaps = 3) {}
  update(dt: number): void { if (this.phase === 'paused' || this.phase === 'finished') return; if (this.phase === 'countdown') { this.countdown -= dt; if (this.countdown <= 0) { this.phase = 'racing'; this.countdown = 0; } return; } this.elapsed += dt; }
  hitCheckpoint(index: number): boolean { if (this.phase !== 'racing' || index !== this.nextCheckpoint) return false; this.nextCheckpoint += 1; return true; }
  crossFinish(): boolean { if (this.phase !== 'racing' || this.nextCheckpoint !== this.checkpointCount) return false; const lapTime = this.elapsed - this.lapStartedAt; this.lapTimes.push(lapTime); this.bestLap = this.bestLap === null ? lapTime : Math.min(this.bestLap, lapTime); this.lapStartedAt = this.elapsed; this.nextCheckpoint = 0; if (this.lap >= this.totalLaps) this.phase = 'finished'; else this.lap += 1; return true; }
  togglePause(): void { if (this.phase === 'finished' || this.phase === 'countdown') return; if (this.phase === 'paused') this.phase = this.previousPhase; else { this.previousPhase = this.phase; this.phase = 'paused'; } }
  snapshot(): RaceSnapshot { return { phase: this.phase, lap: this.lap, totalLaps: this.totalLaps, elapsed: this.elapsed, lapElapsed: this.elapsed - this.lapStartedAt, bestLap: this.bestLap, countdown: this.countdown, progress: this.nextCheckpoint / this.checkpointCount }; }
}
