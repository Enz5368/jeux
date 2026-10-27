import * as THREE from 'three';
import type { CharacterDefinition } from '../characters/characters';
import type { VehicleState } from '../types';
export class BuggyView {
  readonly group = new THREE.Group(); private wheels: THREE.Mesh[] = []; private glow: THREE.PointLight; private trail: THREE.Mesh;
  constructor(character: CharacterDefinition) {
    const bodyMat = new THREE.MeshStandardMaterial({ color: character.color, roughness: .55, metalness: .15 }); const dark = new THREE.MeshStandardMaterial({ color: 0x17151c, roughness: .8 });
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.55, .48, 2.45), bodyMat); chassis.position.y = .55; chassis.castShadow = true; this.group.add(chassis);
    const nose = new THREE.Mesh(new THREE.BoxGeometry(1.2, .34, 1), bodyMat); nose.position.set(0, .53, 1.35); nose.rotation.x = -.08; this.group.add(nose);
    const cabin = new THREE.Mesh(new THREE.CylinderGeometry(.7, .82, .75, 6), bodyMat); cabin.position.set(0, 1.05, -.25); this.group.add(cabin);
    const head = new THREE.Mesh(new THREE.SphereGeometry(.36, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf0bb83 })); head.position.set(0, 1.52, -.25); this.group.add(head);
    for (const x of [-.92, .92]) for (const z of [-.85, .85]) { const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.4, .4, .32, 12), dark); wheel.rotation.z = Math.PI / 2; wheel.position.set(x, .38, z); wheel.castShadow = true; this.group.add(wheel); this.wheels.push(wheel); }
    const bar = new THREE.Mesh(new THREE.TorusGeometry(.66, .06, 6, 12, Math.PI), dark); bar.position.set(0, 1.25, -.2); bar.rotation.y = Math.PI / 2; this.group.add(bar);
    this.glow = new THREE.PointLight(character.accent, 0, 6); this.glow.position.set(0, .5, -1.5); this.group.add(this.glow);
    this.trail = new THREE.Mesh(new THREE.ConeGeometry(.35, 2, 8), new THREE.MeshBasicMaterial({ color: character.accent, transparent: true, opacity: .7 })); this.trail.rotation.x = -Math.PI / 2; this.trail.position.set(0, .35, -2); this.trail.visible = false; this.group.add(this.trail);
  }
  update(state: VehicleState, dt: number, active: boolean, ghost: boolean): void { this.group.position.set(state.position.x, state.position.y - .55, state.position.z); this.group.rotation.y = state.rotation; this.wheels.forEach((wheel) => { wheel.rotation.x -= state.speed * dt * 2.3; }); this.glow.intensity = active ? 4 : 0; this.trail.visible = active; this.group.traverse((object) => { if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) { object.material.transparent = ghost; object.material.opacity = ghost ? .48 : 1; } }); }
}
