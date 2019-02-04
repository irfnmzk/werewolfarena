export type time = 'DAY' | 'NIGHT' | 'DUSK';
export type RoleId =
  | 'default'
  | 'villager'
  | 'wolf'
  | 'guardian'
  | 'seer'
  | 'drunk'
  | 'fool';
export type RoleName =
  | 'default'
  | 'Villager'
  | 'Wolf'
  | 'Guardian'
  | 'Seer'
  | 'Drunk'
  | 'Fool';
export type EventType = 'punishment' | 'vote' | 'bite' | 'protect' | 'see';
export type Team = 'VILLAGER' | 'WEREWOLF';
export type BuffName = 'protected' | 'drunk';

export interface Buff {
  name: BuffName;
  duration: number;
}

export interface BackEvent {
  type: 'GAME_EVENT' | 'DEFAULT';
  data: GameEvent;
}

export interface GameEvent {
  event: EventType;
  targetId: string;
  groupId: string;
  timeStamp: number;
}
