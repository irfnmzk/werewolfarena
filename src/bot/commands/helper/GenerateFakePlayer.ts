/* tslint:disable:prefer-for-of */
import Player from '@game/base/Player';

export default function generateFakePlayers(num: number): Player[] {
  const results: Player[] = [];
  for (let index = 0; index < num; index++) {
    results.push({
      name: `player ${index}`,
      userId: `player_${index}`
    });
  }
  return results;
}
