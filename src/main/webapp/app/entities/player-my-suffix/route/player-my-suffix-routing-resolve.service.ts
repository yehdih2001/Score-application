import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlayerMySuffix, PlayerMySuffix } from '../player-my-suffix.model';
import { PlayerMySuffixService } from '../service/player-my-suffix.service';

@Injectable({ providedIn: 'root' })
export class PlayerMySuffixRoutingResolveService implements Resolve<IPlayerMySuffix> {
  constructor(protected service: PlayerMySuffixService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlayerMySuffix> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((player: HttpResponse<PlayerMySuffix>) => {
          if (player.body) {
            return of(player.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PlayerMySuffix());
  }
}
