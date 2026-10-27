import * as THREE from 'three';
import type { CharacterDefinition } from '../characters/characters';
import type { VehicleState } from '../types';
import { FollowCamera } from '../camera/FollowCamera'; import { DustValley } from '../tracks/DustValley'; import { BuggyView } from '../vehicles/BuggyView';
export type Quality = 'low' | 'medium' | 'high';
export class Renderer {
  readonly scene = new THREE.Scene(); readonly camera = new THREE.PerspectiveCamera(62, 1, .1, 250); readonly renderer: THREE.WebGLRenderer; readonly track = new DustValley(); readonly buggy: BuggyView; private follow: FollowCamera; private clock = 0;
  constructor(container: HTMLElement, character: CharacterDefinition, quality: Quality) {
    this.renderer = new THREE.WebGLRenderer({ antialias: quality !== 'low', powerPreference: 'high-performance' }); this.renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'high' ? 1.75 : quality === 'medium' ? 1.25 : 1)); this.renderer.shadowMap.enabled = quality !== 'low'; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; this.renderer.outputColorSpace = THREE.SRGBColorSpace; this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.1; container.prepend(this.renderer.domElement);
    this.scene.background = new THREE.Color(0x72bada); this.scene.fog = new THREE.Fog(0xd59b62, 55, 145); this.scene.add(this.track.build());
    const hemi = new THREE.HemisphereLight(0xbbe7ff, 0x8b512f, 2.4); this.scene.add(hemi); const sun = new THREE.DirectionalLight(0xffefd0, 3); sun.position.set(-25, 40, 18); sun.castShadow = quality !== 'low'; sun.shadow.mapSize.set(quality === 'high' ? 2048 : 1024, quality === 'high' ? 2048 : 1024); sun.shadow.camera.left = -48; sun.shadow.camera.right = 48; sun.shadow.camera.top = 48; sun.shadow.camera.bottom = -48; this.scene.add(sun);
    this.buggy = new BuggyView(character); this.scene.add(this.buggy.group); this.follow = new FollowCamera(this.camera); this.resize(); window.addEventListener('resize', this.resize);
  }
  render(state: VehicleState, dt: number, active: boolean, ghost: boolean): void { this.clock += dt; this.buggy.update(state, dt, active, ghost); this.follow.update(this.buggy.group.position, state.rotation, dt); this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 62 + Math.min(12, state.speed * .4), .06); this.camera.updateProjectionMatrix(); this.renderer.render(this.scene, this.camera); }
  private resize = (): void => { const parent = this.renderer.domElement.parentElement; if (!parent) return; const width = parent.clientWidth; const height = parent.clientHeight; this.camera.aspect = width / Math.max(1, height); this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height, false); };
  dispose(): void { window.removeEventListener('resize', this.resize); this.renderer.dispose(); this.renderer.domElement.remove(); }
}
