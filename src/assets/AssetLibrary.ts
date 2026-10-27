import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type AssetProgress = (loaded: number, total: number) => void;

/** Central cache for static GLB/glTF scenery. Each source is fetched once and cloned for placement. */
export class AssetLibrary {
  private readonly loader = new GLTFLoader();
  private readonly cache = new Map<string, Promise<THREE.Group | null>>();

  load(url: string, progress?: AssetProgress): Promise<THREE.Group | null> {
    const existing = this.cache.get(url); if (existing) return existing;
    const request = new Promise<THREE.Group | null>((resolve) => {
      this.loader.load(url, (gltf) => {
        gltf.scene.traverse((node) => { if (node instanceof THREE.Mesh) { node.castShadow = true; node.receiveShadow = true; } });
        resolve(gltf.scene);
      }, (event) => progress?.(event.loaded, event.total || 0), (error) => { console.warn(`Asset indisponible : ${url}`, error); resolve(null); });
    });
    this.cache.set(url, request); return request;
  }

  async place(url: string, parent: THREE.Object3D, position: THREE.Vector3, rotationY = 0, scale = 1): Promise<THREE.Group | null> {
    const source = await this.load(url); if (!source) return null;
    const copy = source.clone(true); copy.position.copy(position); copy.rotation.y = rotationY; copy.scale.setScalar(scale); parent.add(copy); return copy;
  }

  clear(): void { this.cache.clear(); }
}

export const assets = new AssetLibrary();
