import Role from '@game/roles/base/Role';

export default interface Player {
  userId: string;
  name: string;

  role?: Role;
}
