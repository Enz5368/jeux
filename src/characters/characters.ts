import type { CharacterId } from '../types';
export interface CharacterDefinition { id: CharacterId; name: string; tagline: string; abilityName: string; abilityDescription: string; color: number; cssColor: string; accent: number; duration: number; cooldown: number; }
export const CHARACTERS: readonly CharacterDefinition[] = [
  { id: 'blaze', name: 'Blaze', tagline: 'Le plus rapide en ligne droite', abilityName: 'Turbo', abilityDescription: 'Survitesse et accélération extrême pendant 3 secondes.', color: 0xe33b2e, cssColor: '#ef493b', accent: 0xff9c38, duration: 3, cooldown: 15 },
  { id: 'frost', name: 'Frost', tagline: 'Le maître des trajectoires', abilityName: 'Adhérence extrême', abilityDescription: 'Accroche maximale et stabilité renforcée pendant 5 secondes.', color: 0x2d80dc, cssColor: '#52a8ff', accent: 0xb9edff, duration: 5, cooldown: 15 },
  { id: 'volt', name: 'Volt', tagline: 'Une impulsion foudroyante', abilityName: 'Impulsion électrique', abilityDescription: 'Bond instantané puis bonus de vitesse pendant 2 secondes.', color: 0x53b748, cssColor: '#79e35e', accent: 0xd2ff4d, duration: 2, cooldown: 18 },
  { id: 'shadow', name: 'Shadow', tagline: 'Insaisissable dans le chaos', abilityName: 'Fantôme', abilityDescription: 'Traverse les obstacles secondaires pendant 2 secondes.', color: 0x7446ad, cssColor: '#ad6cff', accent: 0xedb7ff, duration: 2, cooldown: 20 }
];
export const characterById = (id: CharacterId) => CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
