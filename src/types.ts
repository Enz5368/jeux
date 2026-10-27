declare const __BUILD_STAMP__: string;

export type CharacterId = 'blaze' | 'frost' | 'volt' | 'shadow';
export type GameScreen = 'menu' | 'character' | 'times' | 'settings' | 'race' | 'results';
export interface ControlState { throttle: number; brake: number; steer: number; drift: boolean; ability: boolean; reset: boolean; }
export const NEUTRAL_CONTROLS: ControlState = { throttle: 0, brake: 0, steer: 0, drift: false, ability: false, reset: false };
export interface VehicleState { position: { x: number; y: number; z: number }; rotation: number; speed: number; verticalVelocity: number; grounded: boolean; }
