export type time = 'FIRST' | 'DAY' | 'NIGHT' | 'DUSK';
export type RoleId =
  | 'default'
  | 'villager'
  | 'werewolf'
  | 'guardian'
  | 'seer'
  | 'drunk'
  | 'fool'
  | 'cursed'
  | 'traitor';
export type RoleName =
  | 'default'
  | 'Villager'
  | 'Werewolf'
  | 'Guardian'
  | 'Seer'
  | 'Drunk'
  | 'Fool'
  | 'Cursed'
  | 'Traitor';
export type EventType = 'punishment' | 'vote' | 'bite' | 'protect' | 'see';
export type Team = 'VILLAGER' | 'WEREWOLF';
export type BuffName = 'protected' | 'drunk';

export interface Buff {
  name: BuffName;
  duration: number;
}

export interface BackEvent {
  type:
    | 'GAME_EVENT'
    | 'DEFAULT'
    | 'WEREWOLF_JOIN_EVENT'
    | 'GET_GROUP_SETTING'
    | 'GET_USER_GROUP_SETTING'
    | 'SET_GROUP_SETTING';
  data?: GameEvent | GroupSetting | string;
}

export interface GroupSetting {
  groupId: string;
  setting: 'DURATION' | 'SHOWROLE';
  value?: any;
}

export interface GameJoinEvent {
  join: true;
}

export interface GameEvent {
  event: EventType;
  targetId: string;
  groupId: string;
  timeStamp: number;
}
