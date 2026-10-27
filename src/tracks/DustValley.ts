import * as THREE from 'three';
export const TRACK_ID = 'dust-valley'; export const CHECKPOINT_COUNT = 7;
export interface TrackProgress { checkpoint: number | null; crossedFinish: boolean; }
export class DustValley {
  readonly group = new THREE.Group(); private lastSector = 7;
  build(): THREE.Group {
    const sand = new THREE.MeshStandardMaterial({ color: 0xc98543, roughness: 1 }); const dirt = new THREE.MeshStandardMaterial({ color: 0x80512f, roughness: 1 });
    const terrain = new THREE.Mesh(new THREE.CylinderGeometry(68, 72, 2, 48), sand); terrain.position.y = -1.1; terrain.receiveShadow = true; this.group.add(terrain);
    const outer = new THREE.Mesh(new THREE.RingGeometry(18, 31, 96), dirt); outer.rotation.x = -Math.PI / 2; outer.scale.z = 0.72; outer.position.y = 0.012; outer.receiveShadow = true; this.group.add(outer);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(17.8, 64), sand); inner.rotation.x = -Math.PI / 2; inner.scale.z = 0.72; inner.position.y = 0.02; this.group.add(inner);
    this.addStart(); this.addScenery(); return this.group;
  }
  private addStart(): void { const white = new THREE.MeshBasicMaterial({ color: 0xf4e7c5 }); const dark = new THREE.MeshBasicMaterial({ color: 0x25212a }); for (let i = -3; i <= 3; i++) for (let j = 0; j < 2; j++) { const tile = new THREE.Mesh(new THREE.BoxGeometry(1.1, .03, .8), (i + j) % 2 ? white : dark); tile.position.set(i * 1.1, .05, 22 + j * .8 - .4); this.group.add(tile); } }
  private addScenery(): void { const rockMat = new THREE.MeshStandardMaterial({ color: 0x74482f, roughness: 1 }); const cactusMat = new THREE.MeshStandardMaterial({ color: 0x397647, roughness: 1 }); for (let i = 0; i < 42; i++) { const a = i * 2.399; const r = i % 3 === 0 ? 39 + (i % 5) : 9 + (i % 4); const mesh = new THREE.Mesh(i % 4 === 0 ? new THREE.CylinderGeometry(.45, .65, 3 + i % 3, 6) : new THREE.DodecahedronGeometry(1 + i % 3 * .35, 0), i % 4 === 0 ? cactusMat : rockMat); mesh.position.set(Math.sin(a) * r, mesh.geometry.type.includes('Cylinder') ? 1.5 : .65, Math.cos(a) * r * .72); mesh.rotation.set(0, a, i * .1); mesh.castShadow = true; this.group.add(mesh); } }
  progress(position: { x: number; z: number }): TrackProgress { const angle = (Math.atan2(position.x / 1, position.z / .72) + Math.PI * 2) % (Math.PI * 2); const sector = Math.floor(angle / (Math.PI * 2 / CHECKPOINT_COUNT)); if (sector === this.lastSector) return { checkpoint: null, crossedFinish: false }; const expected = (this.lastSector + 1) % CHECKPOINT_COUNT; if (sector !== expected) return { checkpoint: null, crossedFinish: false }; this.lastSector = sector; return sector === 0 ? { checkpoint: null, crossedFinish: true } : { checkpoint: sector - 1, crossedFinish: false }; }
  resetProgress(): void { this.lastSector = 7; }
}
