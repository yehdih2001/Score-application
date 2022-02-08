import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeamMySuffix, TeamMySuffix } from '../team-my-suffix.model';
import { TeamMySuffixService } from '../service/team-my-suffix.service';

@Injectable({ providedIn: 'root' })
export class TeamMySuffixRoutingResolveService implements Resolve<ITeamMySuffix> {
  constructor(protected service: TeamMySuffixService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeamMySuffix> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((team: HttpResponse<TeamMySuffix>) => {
          if (team.body) {
            return of(team.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TeamMySuffix());
  }
}
