import * as THREE from 'three';
import { assets } from '../assets/AssetLibrary';
import { loadTrackMap, placeTrackObjects } from './TrackMap';
export const TRACK_ID = 'forest-valley'; export const CHECKPOINT_COUNT = 7;
export interface TrackProgress { checkpoint: number | null; crossedFinish: boolean; }
export class DustValley {
  readonly group = new THREE.Group(); private lastSector = 7;
  build(): THREE.Group {
    const sand = new THREE.MeshStandardMaterial({ color: 0xb86631, roughness: 1 }); const asphalt = new THREE.MeshStandardMaterial({ color: 0x2d3440, roughness: .92 });
    const terrain = new THREE.Mesh(new THREE.CylinderGeometry(70, 76, 2, 64), sand); terrain.position.y = -1.1; terrain.receiveShadow = true; this.group.add(terrain);
    const road = new THREE.Mesh(new THREE.RingGeometry(14.7, 29.3, 112), asphalt); road.rotation.x = -Math.PI / 2; road.scale.z = .72; road.position.y = .015; road.receiveShadow = true; this.group.add(road);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(14.6, 64), new THREE.MeshStandardMaterial({ color: 0xc8783b, roughness: 1 })); inner.rotation.x = -Math.PI / 2; inner.scale.z = .72; inner.position.y = .02; inner.receiveShadow = true; this.group.add(inner);
    this.addRoadMarks(); this.addStart(); this.addCheckpoints(); this.addGuardrails(); this.addScenery(); void this.addImportedNature(); return this.group;
  }
  private addStart(): void { const white = new THREE.MeshBasicMaterial({ color: 0xf4e7c5 }); const dark = new THREE.MeshBasicMaterial({ color: 0x25212a }); for (let i = -3; i <= 3; i++) for (let j = 0; j < 2; j++) { const tile = new THREE.Mesh(new THREE.BoxGeometry(1.1, .03, .8), (i + j) % 2 ? white : dark); tile.position.set(i * 1.1, .05, 22 + j * .8 - .4); this.group.add(tile); } }
  private addRoadMarks(): void {
    const paint = new THREE.MeshBasicMaterial({ color: 0xf8d98b });
    for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2; const r = 22; const mark = new THREE.Mesh(new THREE.BoxGeometry(.32, .025, 1.25), paint); mark.position.set(Math.sin(a) * r, .045, Math.cos(a) * r * .72); mark.rotation.y = a; this.group.add(mark); }
  }
  private addGuardrails(): void {
    const railMat = new THREE.MeshStandardMaterial({ color: 0xf3d9a3, roughness: .65, metalness: .2 }); const postMat = new THREE.MeshStandardMaterial({ color: 0x44505a, roughness: .65 });
    for (const r of [14.65, 29.35]) for (let i = 0; i < 56; i++) { const a = i / 56 * Math.PI * 2; const x = Math.sin(a) * r; const z = Math.cos(a) * r * .72; const rail = new THREE.Mesh(new THREE.BoxGeometry(1.3, .18, .16), railMat); rail.position.set(x, .66, z); rail.rotation.y = a + Math.PI / 2; rail.castShadow = true; this.group.add(rail); if (i % 2 === 0) { const post = new THREE.Mesh(new THREE.BoxGeometry(.1, .72, .1), postMat); post.position.set(x, .35, z); post.castShadow = true; this.group.add(post); } }
  }
  private addCheckpoints(): void {
    const glow = new THREE.MeshBasicMaterial({ color: 0xffb34d }); const frame = new THREE.MeshStandardMaterial({ color: 0x30535b, roughness: .55, metalness: .2 });
    for (let i = 1; i < CHECKPOINT_COUNT; i++) { const a = i / CHECKPOINT_COUNT * Math.PI * 2; const x = Math.sin(a) * 22; const z = Math.cos(a) * 22 * .72; const gate = new THREE.Group(); for (const side of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.26, 3.2, .26), frame); p.position.set(side * 5.7, 1.6, 0); gate.add(p); const lamp = new THREE.Mesh(new THREE.SphereGeometry(.3, 8, 6), glow); lamp.position.set(side * 5.7, 3.3, 0); gate.add(lamp); } const top = new THREE.Mesh(new THREE.BoxGeometry(11.6, .22, .26), frame); top.position.y = 3.2; gate.add(top); gate.position.set(x, 0, z); gate.rotation.y = a; this.group.add(gate); }
  }
  private addScenery(): void {
    const rock = new THREE.MeshStandardMaterial({ color: 0x783d28, roughness: 1 }); const pine = new THREE.MeshStandardMaterial({ color: 0x1d5a4e, roughness: .9 }); const wood = new THREE.MeshStandardMaterial({ color: 0x754326, roughness: .9 });
    for (let i = 0; i < 70; i++) { const a = i * 2.399; const r = i % 3 === 0 ? 35 + i % 9 : 7 + i % 5; const size = .8 + (i % 4) * .45; const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(size, 0), rock); boulder.position.set(Math.sin(a) * r, size * .55, Math.cos(a) * r * .72); boulder.rotation.set(i * .2, a, 0); boulder.castShadow = true; this.group.add(boulder); if (i % 5 === 0) this.addPine(boulder.position.x + 2, boulder.position.z - 1, pine, 1 + i % 3 * .25); }
    // Landmark set: a small camp, a wood bridge and a waterfall beyond the east ravine.
    const camp = new THREE.Group(); const tent = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2, 4), new THREE.MeshStandardMaterial({ color: 0xd95235, roughness: .8 })); tent.rotation.y = Math.PI / 4; tent.position.y = 1; camp.add(tent); const fire = new THREE.PointLight(0xff8b3d, 2, 12); fire.position.set(0, .5, 0); camp.add(fire); camp.position.set(-39, 0, -8); this.group.add(camp);
    const bridge = new THREE.Group(); for (let i = -4; i <= 4; i++) { const plank = new THREE.Mesh(new THREE.BoxGeometry(.8, .16, 7), wood); plank.position.set(i * .82, .45, 0); plank.castShadow = true; bridge.add(plank); } bridge.position.set(35, 0, 0); bridge.rotation.y = Math.PI / 2; this.group.add(bridge);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(8, 16), new THREE.MeshBasicMaterial({ color: 0x5bc7d9, transparent: true, opacity: .72 })); water.position.set(42, 6, -18); this.group.add(water);
    this.addCanyonLandmarks(rock, wood);
  }
  private addCanyonLandmarks(rock: THREE.Material, wood: THREE.Material): void {
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0xa94d29, roughness: 1, flatShading: true });
    // Tall landmark spires frame the course; they make the world read as a canyon journey,
    // rather than an empty arena, while keeping the middle of the track easy to navigate.
    const spires = [[-47, -25, 18, 7], [-42, 24, 23, 9], [38, -29, 26, 10], [47, 22, 20, 8], [-4, -38, 16, 6], [8, 37, 19, 7]];
    for (const [x, z, h, r] of spires) { const base = new THREE.Mesh(new THREE.CylinderGeometry(r * .62, r, h, 7), cliffMat); base.position.set(x, h / 2 - .2, z); base.rotation.y = (x + z) * .08; base.castShadow = true; base.receiveShadow = true; this.group.add(base); const cap = new THREE.Mesh(new THREE.DodecahedronGeometry(r * .7, 0), rock); cap.position.set(x + 1.2, h + .4, z - .8); cap.scale.y = .65; cap.castShadow = true; this.group.add(cap); }
    const ravine = new THREE.Mesh(new THREE.BoxGeometry(13, .4, 26), new THREE.MeshStandardMaterial({ color: 0x174b58, roughness: .4, metalness: .1 })); ravine.position.set(42, -.15, -2); this.group.add(ravine);
    const ropeBridge = new THREE.Group(); for (let i = -7; i <= 7; i++) { const plank = new THREE.Mesh(new THREE.BoxGeometry(.75, .14, 4.6), wood); plank.position.set(i * .72, .85 + Math.abs(i) * .025, 0); plank.castShadow = true; ropeBridge.add(plank); } for (const side of [-1, 1]) { const rope = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, 11, 6), new THREE.MeshStandardMaterial({ color: 0x33251d })); rope.rotation.z = Math.PI / 2; rope.position.set(0, 2.25, side * 2.25); ropeBridge.add(rope); } ropeBridge.position.set(42, 0, -2); ropeBridge.rotation.y = Math.PI / 2; this.group.add(ropeBridge);
    const trailer = new THREE.Group(); const shell = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.5, 2.3), new THREE.MeshStandardMaterial({ color: 0xe7d9bd, roughness: .7 })); shell.position.y = 1.7; trailer.add(shell); const stripe = new THREE.Mesh(new THREE.BoxGeometry(5.3, .34, 2.34), new THREE.MeshStandardMaterial({ color: 0x3e7180, roughness: .75 })); stripe.position.y = 1.35; trailer.add(stripe); for (const x of [-1.7, 1.7]) { const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .25, 10), new THREE.MeshStandardMaterial({ color: 0x202128 })); wheel.rotation.x = Math.PI / 2; wheel.position.set(x, .45, 1.2); trailer.add(wheel); } trailer.position.set(-37, 0, 15); trailer.rotation.y = -.55; this.group.add(trailer);
  }
  private addPine(x: number, z: number, material: THREE.Material, scale: number): void { const tree = new THREE.Group(); const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18, .28, 2, 6), new THREE.MeshStandardMaterial({ color: 0x553321, roughness: 1 })); trunk.position.y = 1; tree.add(trunk); for (let i = 0; i < 3; i++) { const crown = new THREE.Mesh(new THREE.ConeGeometry(1.25 - i * .2, 2.2, 7), material); crown.position.y = 1.8 + i * .7; crown.castShadow = true; tree.add(crown); } tree.position.set(x, 0, z); tree.scale.setScalar(scale); this.group.add(tree); }
  private async addImportedNature(): Promise<void> {
    const root = '/assets/models/kenney/';
    const pine = `${root}tree_pineTallA.glb`; const rock = `${root}rock_largeA.glb`; const cliff = `${root}cliff_large_rock.glb`;
    const trees = [[-33, -17], [-36, -11], [-30, 9], [-27, 18], [31, -16], [35, -8], [30, 12], [27, 20], [-8, -30], [10, 31]];
    await Promise.all(trees.map(([x, z], index) => assets.place(pine, this.group, new THREE.Vector3(x, 0, z), index * .73, 1.4 + index % 3 * .18)));
    await Promise.all([[-38, -28], [-42, 22], [43, 25]].map(([x, z], index) => assets.place(cliff, this.group, new THREE.Vector3(x, 0, z), index * 1.4, 4.2)));
    await Promise.all([[-18, -4], [18, 7], [-13, 26], [14, -26]].map(([x, z], index) => assets.place(rock, this.group, new THREE.Vector3(x, 0, z), index, 1.4)));
    const map = await loadTrackMap('/tracks/forest-valley.json'); if (map) await placeTrackObjects(map, this.group);
  }
  progress(position: { x: number; z: number }): TrackProgress { const angle = (Math.atan2(position.x / 1, position.z / .72) + Math.PI * 2) % (Math.PI * 2); const sector = Math.floor(angle / (Math.PI * 2 / CHECKPOINT_COUNT)); if (sector === this.lastSector) return { checkpoint: null, crossedFinish: false }; const expected = (this.lastSector + 1) % CHECKPOINT_COUNT; if (sector !== expected) return { checkpoint: null, crossedFinish: false }; this.lastSector = sector; return sector === 0 ? { checkpoint: null, crossedFinish: true } : { checkpoint: sector - 1, crossedFinish: false }; }
  resetProgress(): void { this.lastSector = 7; }
}
