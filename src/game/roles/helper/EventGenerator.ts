import qs from 'qs';
import { BackEvent } from '../base/RoleTypes';

export default function generateEvent(event: BackEvent): string {
  return qs.stringify(event);
}
