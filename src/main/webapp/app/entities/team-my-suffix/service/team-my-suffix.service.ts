import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ITeamMySuffix, getTeamMySuffixIdentifier } from '../team-my-suffix.model';

export type EntityResponseType = HttpResponse<ITeamMySuffix>;
export type EntityArrayResponseType = HttpResponse<ITeamMySuffix[]>;

@Injectable({ providedIn: 'root' })
export class TeamMySuffixService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/teams');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/teams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(team: ITeamMySuffix): Observable<EntityResponseType> {
    return this.http.post<ITeamMySuffix>(this.resourceUrl, team, { observe: 'response' });
  }

  update(team: ITeamMySuffix): Observable<EntityResponseType> {
    return this.http.put<ITeamMySuffix>(`${this.resourceUrl}/${getTeamMySuffixIdentifier(team) as number}`, team, { observe: 'response' });
  }

  partialUpdate(team: ITeamMySuffix): Observable<EntityResponseType> {
    return this.http.patch<ITeamMySuffix>(`${this.resourceUrl}/${getTeamMySuffixIdentifier(team) as number}`, team, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITeamMySuffix>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeamMySuffix[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeamMySuffix[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addTeamMySuffixToCollectionIfMissing(
    teamCollection: ITeamMySuffix[],
    ...teamsToCheck: (ITeamMySuffix | null | undefined)[]
  ): ITeamMySuffix[] {
    const teams: ITeamMySuffix[] = teamsToCheck.filter(isPresent);
    if (teams.length > 0) {
      const teamCollectionIdentifiers = teamCollection.map(teamItem => getTeamMySuffixIdentifier(teamItem)!);
      const teamsToAdd = teams.filter(teamItem => {
        const teamIdentifier = getTeamMySuffixIdentifier(teamItem);
        if (teamIdentifier == null || teamCollectionIdentifiers.includes(teamIdentifier)) {
          return false;
        }
        teamCollectionIdentifiers.push(teamIdentifier);
        return true;
      });
      return [...teamsToAdd, ...teamCollection];
    }
    return teamCollection;
  }
}
