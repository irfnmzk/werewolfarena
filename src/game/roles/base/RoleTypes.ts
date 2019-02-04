export type time = 'DAY' | 'NIGHT' | 'DUSK';
export type RoleId =
  | 'default'
  | 'villager'
  | 'werewolf'
  | 'guardian'
  | 'seer'
  | 'drunk'
  | 'fool'
  | 'cursed';
export type RoleName =
  | 'default'
  | 'Villager'
  | 'Werewolf'
  | 'Guardian'
  | 'Seer'
  | 'Drunk'
  | 'Fool'
  | 'Cursed';
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
