import { GameEvent, EventType } from '../../game/roles/base/RoleTypes';
import { groupId } from '../scenario/GameScenario';

export default function generateEvent(
  event: EventType,
  targetId: string
): GameEvent {
  return {
    event,
    targetId,
    groupId,
    timeStamp: Date.now()
  };
}
