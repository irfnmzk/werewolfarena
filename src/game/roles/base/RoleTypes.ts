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
  | 'traitor'
  | 'lumberjack'
  | 'gunner'
  | 'harlot'
  | 'hunter'
  | 'wolfman'
  | 'lycan'
  | 'beholder'
  | 'princess'
  | 'tanner'
  | 'doctor'
  | 'cupid'
  | 'cultist';
export type RoleName =
  | 'default'
  | 'Villager'
  | 'Werewolf'
  | 'Guardian'
  | 'Seer'
  | 'Drunk'
  | 'Fool'
  | 'Cursed'
  | 'Traitor'
  | 'Lumberjack'
  | 'Gunner'
  | 'Harlot'
  | 'Hunter'
  | 'Wolfman'
  | 'Lycan'
  | 'Beholder'
  | 'Princess'
  | 'Tanner'
  | 'Doctor'
  | 'Cupid'
  | 'Cultist';
export type EventType =
  | 'punishment'
  | 'vote'
  | 'bite'
  | 'protect'
  | 'see'
  | 'shoot'
  | 'visit'
  | 'revenge'
  | 'revive'
  | 'cupid'
  | 'suicide'
  | 'culting';
export type Team = 'VILLAGER' | 'WEREWOLF' | 'TANNER' | 'LOVER';
export type BuffName = 'protected' | 'drunk' | 'visiting' | 'visited';

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
