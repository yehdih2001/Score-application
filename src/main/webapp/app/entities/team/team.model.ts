export interface ITeam {
  id?: number;
  name?: string | null;
  pictureContentType?: string | null;
  picture?: string | null;
}

export class Team implements ITeam {
  constructor(public id?: number, public name?: string | null, public pictureContentType?: string | null, public picture?: string | null) {}
}

export function getTeamIdentifier(team: ITeam): number | undefined {
  return team.id;
}
