import * as THREE from 'three';
export class FollowCamera {
  private target = new THREE.Vector3(); private desired = new THREE.Vector3();
  constructor(private readonly camera: THREE.PerspectiveCamera) {}
  snap(position: THREE.Vector3, rotation: number): void { this.place(position, rotation); this.camera.position.copy(this.desired); }
  update(position: THREE.Vector3, rotation: number, dt: number): void { this.place(position, rotation); this.camera.position.lerp(this.desired, 1 - Math.exp(-dt * 5)); this.target.lerp(new THREE.Vector3(position.x, position.y + .9, position.z), 1 - Math.exp(-dt * 8)); this.camera.lookAt(this.target); }
  private place(position: THREE.Vector3, rotation: number): void { this.desired.set(position.x - Math.sin(rotation) * 8, position.y + 5, position.z - Math.cos(rotation) * 8); }
}
