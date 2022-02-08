import dayjs from 'dayjs/esm';
import { ITeamMySuffix } from 'app/entities/team-my-suffix/team-my-suffix.model';

export interface IPlayerMySuffix {
  id?: number;
  name?: string | null;
  dateOfBirth?: dayjs.Dayjs | null;
  actualTeam?: ITeamMySuffix | null;
}

export class PlayerMySuffix implements IPlayerMySuffix {
  constructor(
    public id?: number,
    public name?: string | null,
    public dateOfBirth?: dayjs.Dayjs | null,
    public actualTeam?: ITeamMySuffix | null
  ) {}
}

export function getPlayerMySuffixIdentifier(player: IPlayerMySuffix): number | undefined {
  return player.id;
}
