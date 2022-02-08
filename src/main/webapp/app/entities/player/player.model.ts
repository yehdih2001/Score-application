import dayjs from 'dayjs/esm';
import { ITeam } from 'app/entities/team/team.model';

export interface IPlayer {
  id?: number;
  name?: string | null;
  dateOfBirth?: dayjs.Dayjs | null;
  actualTeam?: ITeam | null;
}

export class Player implements IPlayer {
  constructor(public id?: number, public name?: string | null, public dateOfBirth?: dayjs.Dayjs | null, public actualTeam?: ITeam | null) {}
}

export function getPlayerIdentifier(player: IPlayer): number | undefined {
  return player.id;
}
