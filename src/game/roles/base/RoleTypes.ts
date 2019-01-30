export type time = 'DAY' | 'NIGHT' | 'DUSK';
export type RoleId = 'default' | 'villager' | 'wolf';
export type RoleName = 'default' | 'Villager' | 'Wolf';
export type EventType = 'vote' | 'bite';

export interface BackEvent {
  type: 'GAME_EVENT' | 'DEFAULT';
  data: GameEvent;
}

export interface GameEvent {
  event: EventType;
  targetId: string;
  groupId: string;
}
