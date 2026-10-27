import RAPIER from '@dimforge/rapier3d-compat';
import { AbilitySystem } from '../abilities/AbilitySystem';
import type { CharacterDefinition } from '../characters/characters';
import type { ControlState, VehicleState } from '../types';

export const FIXED_DT = 1 / 60;
export class Simulation {
  readonly world: RAPIER.World;
  readonly body: RAPIER.RigidBody;
  readonly ability: AbilitySystem;
  tick = 0;
  private lastSafe = { x: 0, y: 1.1, z: 22, rotation: Math.PI / 2 };
  private stuckFor = 0;
  private justActivated = false;
  constructor(readonly character: CharacterDefinition) {
    this.world = new RAPIER.World({ x: 0, y: -18, z: 0 }); this.world.timestep = FIXED_DT;
    const ground = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0)); this.world.createCollider(RAPIER.ColliderDesc.cuboid(80, 0.5, 80).setFriction(1.2), ground);
    this.body = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 1.2, 22).setCanSleep(false).setLinearDamping(0.25).setAngularDamping(3));
    this.world.createCollider(RAPIER.ColliderDesc.cuboid(0.85, 0.38, 1.35).setMass(1.3).setFriction(0.9).setRestitution(0.05), this.body);
    this.ability = new AbilitySystem(character);
  }
  step(input: ControlState, racing: boolean): void {
    this.tick += 1; const dt = FIXED_DT; this.justActivated = this.ability.update(dt, input.ability);
    if (input.reset) this.reset();
    const rotation = this.body.rotation(); const yaw = Math.atan2(2 * (rotation.w * rotation.y + rotation.x * rotation.z), 1 - 2 * (rotation.y * rotation.y + rotation.z * rotation.z));
    const velocity = this.body.linvel(); const forwardX = Math.sin(yaw); const forwardZ = Math.cos(yaw); const forwardSpeed = velocity.x * forwardX + velocity.z * forwardZ;
    if (racing) {
      let acceleration = 19; let maxSpeed = 22; let grip = input.drift ? 0.72 : 0.9;
      if (this.ability.state.active) { if (this.character.id === 'blaze') { acceleration = 34; maxSpeed = 32; } if (this.character.id === 'frost') { acceleration = 23; grip = 0.98; } if (this.character.id === 'volt') { maxSpeed = 29; acceleration = 27; } }
      if (this.justActivated && this.character.id === 'volt') this.body.applyImpulse({ x: forwardX * 8, y: 1.2, z: forwardZ * 8 }, true);
      const engine = input.throttle * acceleration - input.brake * (forwardSpeed > 1 ? 30 : -11);
      if (Math.abs(forwardSpeed) < maxSpeed || Math.sign(engine) !== Math.sign(forwardSpeed)) this.body.applyImpulse({ x: forwardX * engine * dt, y: 0, z: forwardZ * engine * dt }, true);
      const lateralX = velocity.x - forwardX * forwardSpeed; const lateralZ = velocity.z - forwardZ * forwardSpeed; this.body.applyImpulse({ x: -lateralX * grip, y: 0, z: -lateralZ * grip }, true);
      const steerScale = Math.min(1, Math.abs(forwardSpeed) / 4); this.body.applyTorqueImpulse({ x: 0, y: input.steer * steerScale * (input.drift ? 0.42 : 0.27) * Math.sign(forwardSpeed || 1), z: 0 }, true);
    }
    this.world.step(); const p = this.body.translation();
    if (p.y > 0.5 && p.y < 3 && Math.hypot(p.x, p.z) < 55) this.lastSafe = { x: p.x, y: 1.1, z: p.z, rotation: yaw };
    this.stuckFor = Math.hypot(velocity.x, velocity.z) < 0.25 && input.throttle > 0 ? this.stuckFor + dt : 0;
    if (p.y < -5 || this.stuckFor > 4) this.reset();
  }
  reset(): void { const s = this.lastSafe; this.body.setTranslation({ x: s.x, y: s.y + 0.6, z: s.z }, true); this.body.setRotation({ x: 0, y: Math.sin(s.rotation / 2), z: 0, w: Math.cos(s.rotation / 2) }, true); this.body.setLinvel({ x: 0, y: 0, z: 0 }, true); this.body.setAngvel({ x: 0, y: 0, z: 0 }, true); this.stuckFor = 0; }
  state(): VehicleState { const p = this.body.translation(); const q = this.body.rotation(); return { position: { x: p.x, y: p.y, z: p.z }, rotation: Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.z * q.z)), speed: Math.hypot(this.body.linvel().x, this.body.linvel().z), verticalVelocity: this.body.linvel().y, grounded: p.y < 1.3 }; }
}
