import type { CharacterDefinition } from '../characters/characters';
export interface AbilityState { active: boolean; activeRemaining: number; cooldownRemaining: number; }
export class AbilitySystem {
  readonly state: AbilityState = { active: false, activeRemaining: 0, cooldownRemaining: 0 };
  private held = false;
  constructor(readonly definition: CharacterDefinition) {}
  update(dt: number, pressed: boolean): boolean {
    let activated = false;
    if (pressed && !this.held && this.state.cooldownRemaining <= 0) { this.state.active = true; this.state.activeRemaining = this.definition.duration; this.state.cooldownRemaining = this.definition.cooldown; activated = true; }
    this.held = pressed; this.state.activeRemaining = Math.max(0, this.state.activeRemaining - dt); this.state.cooldownRemaining = Math.max(0, this.state.cooldownRemaining - dt); this.state.active = this.state.activeRemaining > 0; return activated;
  }
  reset(): void { Object.assign(this.state, { active: false, activeRemaining: 0, cooldownRemaining: 0 }); this.held = false; }
  get ready(): boolean { return this.state.cooldownRemaining <= 0; }
  get cooldownProgress(): number { return this.ready ? 1 : 1 - this.state.cooldownRemaining / this.definition.cooldown; }
}
