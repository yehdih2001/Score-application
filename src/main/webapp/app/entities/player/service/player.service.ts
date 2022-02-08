import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPlayer, getPlayerIdentifier } from '../player.model';

export type EntityResponseType = HttpResponse<IPlayer>;
export type EntityArrayResponseType = HttpResponse<IPlayer[]>;

@Injectable({ providedIn: 'root' })
export class PlayerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/players');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/players');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(player: IPlayer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(player);
    return this.http
      .post<IPlayer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(player: IPlayer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(player);
    return this.http
      .put<IPlayer>(`${this.resourceUrl}/${getPlayerIdentifier(player) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(player: IPlayer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(player);
    return this.http
      .patch<IPlayer>(`${this.resourceUrl}/${getPlayerIdentifier(player) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPlayer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPlayer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPlayer[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addPlayerToCollectionIfMissing(playerCollection: IPlayer[], ...playersToCheck: (IPlayer | null | undefined)[]): IPlayer[] {
    const players: IPlayer[] = playersToCheck.filter(isPresent);
    if (players.length > 0) {
      const playerCollectionIdentifiers = playerCollection.map(playerItem => getPlayerIdentifier(playerItem)!);
      const playersToAdd = players.filter(playerItem => {
        const playerIdentifier = getPlayerIdentifier(playerItem);
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

  protected convertDateFromClient(player: IPlayer): IPlayer {
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
      res.body.forEach((player: IPlayer) => {
        player.dateOfBirth = player.dateOfBirth ? dayjs(player.dateOfBirth) : undefined;
      });
    }
    return res;
  }
}
