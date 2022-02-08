import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TeamMySuffixComponent } from '../list/team-my-suffix.component';
import { TeamMySuffixDetailComponent } from '../detail/team-my-suffix-detail.component';
import { TeamMySuffixUpdateComponent } from '../update/team-my-suffix-update.component';
import { TeamMySuffixRoutingResolveService } from './team-my-suffix-routing-resolve.service';

const teamRoute: Routes = [
  {
    path: '',
    component: TeamMySuffixComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeamMySuffixDetailComponent,
    resolve: {
      team: TeamMySuffixRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeamMySuffixUpdateComponent,
    resolve: {
      team: TeamMySuffixRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeamMySuffixUpdateComponent,
    resolve: {
      team: TeamMySuffixRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(teamRoute)],
  exports: [RouterModule],
})
export class TeamMySuffixRoutingModule {}
