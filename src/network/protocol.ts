import type { CharacterId, ControlState, VehicleState } from '../types';
export const PROTOCOL_VERSION = 1; export const MAX_PLAYERS = 8;
export type PlayerId = string; export type RoomId = string;
export interface PlayerIdentity { id: PlayerId; displayName: string; characterId: CharacterId; }
export type ClientMessage = { type: 'hello'; protocol: number; player: Omit<PlayerIdentity, 'id'> } | { type: 'create_room'; private: true } | { type: 'join_room'; roomId: RoomId } | { type: 'input'; sequence: number; tick: number; controls: ControlState } | { type: 'leave_room' } | { type: 'ping'; sentAt: number };
export type ServerMessage = { type: 'welcome'; playerId: PlayerId; serverTickRate: number } | { type: 'room'; roomId: RoomId; players: PlayerIdentity[]; hostId: PlayerId } | { type: 'snapshot'; tick: number; acknowledgedInput: number; players: Record<PlayerId, VehicleState> } | { type: 'race_event'; event: 'countdown' | 'start' | 'finish'; atTick: number } | { type: 'error'; code: string; message: string } | { type: 'pong'; sentAt: number; serverAt: number };
export interface NetworkTransport { connect(url: string): Promise<void>; send(message: ClientMessage): void; close(): void; onMessage(handler: (message: ServerMessage) => void): () => void; }
