import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPlayerMySuffix, getPlayerMySuffixIdentifier } from '../player-my-suffix.model';

export type EntityResponseType = HttpResponse<IPlayerMySuffix>;
export type EntityArrayResponseType = HttpResponse<IPlayerMySuffix[]>;

@Injectable({ providedIn: 'root' })
export class PlayerMySuffixService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/players');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/players');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(player: IPlayerMySuffix): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(player);
    return this.http
      .post<IPlayerMySuffix>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(player: IPlayerMySuffix): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(player);
    return this.http
      .put<IPlayerMySuffix>(`${this.resourceUrl}/${getPlayerMySuffixIdentifier(player) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(player: IPlayerMySuffix): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(player);
    return this.http
      .patch<IPlayerMySuffix>(`${this.resourceUrl}/${getPlayerMySuffixIdentifier(player) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPlayerMySuffix>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPlayerMySuffix[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPlayerMySuffix[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addPlayerMySuffixToCollectionIfMissing(
    playerCollection: IPlayerMySuffix[],
    ...playersToCheck: (IPlayerMySuffix | null | undefined)[]
  ): IPlayerMySuffix[] {
    const players: IPlayerMySuffix[] = playersToCheck.filter(isPresent);
    if (players.length > 0) {
      const playerCollectionIdentifiers = playerCollection.map(playerItem => getPlayerMySuffixIdentifier(playerItem)!);
      const playersToAdd = players.filter(playerItem => {
        const playerIdentifier = getPlayerMySuffixIdentifier(playerItem);
        if (playerIdentifier == null || playerCollectionIdentifiers.includes(playerIdentifier)) {
          return false;
        }
        playerCollectionIdentifiers.push(playerIdentifier);
        return true;
      });
      return [...playersToAdd, ...playerCollection];
    }
    return playerCollection;
  }

  protected convertDateFromClient(player: IPlayerMySuffix): IPlayerMySuffix {
    return Object.assign({}, player, {
      dateOfBirth: player.dateOfBirth?.isValid() ? player.dateOfBirth.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateOfBirth = res.body.dateOfBirth ? dayjs(res.body.dateOfBirth) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((player: IPlayerMySuffix) => {
        player.dateOfBirth = player.dateOfBirth ? dayjs(player.dateOfBirth) : undefined;
      });
    }
    return res;
  }
}
