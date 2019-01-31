export type time = 'DAY' | 'NIGHT' | 'DUSK';
export type RoleId = 'default' | 'villager' | 'wolf' | 'guardian';
export type RoleName = 'default' | 'Villager' | 'Wolf' | 'Guardian';
export type EventType = 'vote' | 'bite' | 'protect';
export type Team = 'VILLAGER' | 'WEREWOLF';
export type BuffName = 'protected';

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
