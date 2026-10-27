import { NEUTRAL_CONTROLS, type ControlState } from '../types';
const BLOCKED = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']);
export class InputManager {
  readonly state: ControlState = { ...NEUTRAL_CONTROLS };
  autoAccelerate = false;
  private keys = new Set<string>();
  private touches = new Map<string, boolean>();
  private resetPulse = false;
  private pauseHandler: (() => void) | null = null;
  constructor(root: HTMLElement) {
    window.addEventListener('keydown', this.onKeyDown, { passive: false }); window.addEventListener('keyup', this.onKeyUp, { passive: false }); window.addEventListener('blur', this.clear);
    root.addEventListener('pointerdown', this.onPointerDown); root.addEventListener('pointerup', this.onPointerUp); root.addEventListener('pointercancel', this.onPointerUp); root.addEventListener('contextmenu', (event) => event.preventDefault());
  }
  setPauseHandler(handler: () => void): void { this.pauseHandler = handler; }
  sample(): ControlState { this.update(); const sampled = { ...this.state, reset: this.resetPulse }; this.resetPulse = false; return sampled; }
  private update(): void { const pressed = (action: string) => this.touches.has(action); this.state.throttle = this.autoAccelerate || this.keys.has('KeyW') || this.keys.has('KeyZ') || this.keys.has('ArrowUp') || pressed('throttle') ? 1 : 0; this.state.brake = this.keys.has('KeyS') || this.keys.has('ArrowDown') || pressed('brake') ? 1 : 0; this.state.steer = (this.keys.has('KeyD') || this.keys.has('ArrowRight') || pressed('right') ? 1 : 0) - (this.keys.has('KeyA') || this.keys.has('KeyQ') || this.keys.has('ArrowLeft') || pressed('left') ? 1 : 0); this.state.drift = this.keys.has('Space') || pressed('drift'); this.state.ability = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || pressed('ability'); }
  private onKeyDown = (event: KeyboardEvent): void => { if (BLOCKED.has(event.code)) event.preventDefault(); this.keys.add(event.code); if (event.code === 'KeyR' && !event.repeat) this.resetPulse = true; if (event.code === 'Escape' && !event.repeat) this.pauseHandler?.(); };
  private onKeyUp = (event: KeyboardEvent): void => { if (BLOCKED.has(event.code)) event.preventDefault(); this.keys.delete(event.code); };
  private onPointerDown = (event: PointerEvent): void => { const button = (event.target as HTMLElement).closest<HTMLElement>('[data-control]'); if (!button) return; event.preventDefault(); button.setPointerCapture(event.pointerId); this.touches.set(button.dataset.control ?? '', true); };
  private onPointerUp = (event: PointerEvent): void => { const button = (event.target as HTMLElement).closest<HTMLElement>('[data-control]'); if (!button) return; this.touches.delete(button.dataset.control ?? ''); };
  clear = (): void => { this.keys.clear(); this.touches.clear(); Object.assign(this.state, NEUTRAL_CONTROLS); };
  dispose(): void { window.removeEventListener('keydown', this.onKeyDown); window.removeEventListener('keyup', this.onKeyUp); window.removeEventListener('blur', this.clear); }
}
