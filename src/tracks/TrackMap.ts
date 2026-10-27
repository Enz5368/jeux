import * as THREE from 'three';
import { assets } from '../assets/AssetLibrary';

export interface TrackObject { id: string; asset: string; position: [number, number, number]; rotationY?: number; scale?: number; collision: 'decor' | 'critical'; }
export interface TrackMap { id: string; name: string; version: number; checkpoints: number; start: { position: [number, number, number]; rotation: number }; objects: TrackObject[]; }

const registry: Record<string, string> = {
  'kenney/tree_pineTallA': '/assets/models/kenney/tree_pineTallA.glb',
  'kenney/rock_largeA': '/assets/models/kenney/rock_largeA.glb',
  'kenney/cliff_large_rock': '/assets/models/kenney/cliff_large_rock.glb',
  'kenney/bridge_wood': '/assets/models/kenney/bridge_wood.glb'
};

export async function loadTrackMap(url: string): Promise<TrackMap | null> {
  try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP ${response.status}`); const map = await response.json() as TrackMap; if (!map.id || !Array.isArray(map.objects)) throw new Error('format de carte invalide'); return map; }
  catch (error) { console.warn(`Carte indisponible : ${url}`, error); return null; }
}

export async function placeTrackObjects(map: TrackMap, parent: THREE.Object3D): Promise<void> {
  await Promise.all(map.objects.map(async (object) => { const url = registry[object.asset]; if (!url) { console.warn(`Asset non enregistré : ${object.asset}`); return; } await assets.place(url, parent, new THREE.Vector3(...object.position), object.rotationY ?? 0, object.scale ?? 1); }));
}
