export interface ITeamMySuffix {
  id?: number;
  name?: string | null;
  pictureContentType?: string | null;
  picture?: string | null;
}

export class TeamMySuffix implements ITeamMySuffix {
  constructor(public id?: number, public name?: string | null, public pictureContentType?: string | null, public picture?: string | null) {}
}

export function getTeamMySuffixIdentifier(team: ITeamMySuffix): number | undefined {
  return team.id;
}
