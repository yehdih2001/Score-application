import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlayerMySuffixComponent } from '../list/player-my-suffix.component';
import { PlayerMySuffixDetailComponent } from '../detail/player-my-suffix-detail.component';
import { PlayerMySuffixUpdateComponent } from '../update/player-my-suffix-update.component';
import { PlayerMySuffixRoutingResolveService } from './player-my-suffix-routing-resolve.service';

const playerRoute: Routes = [
  {
    path: '',
    component: PlayerMySuffixComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlayerMySuffixDetailComponent,
    resolve: {
      player: PlayerMySuffixRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlayerMySuffixUpdateComponent,
    resolve: {
      player: PlayerMySuffixRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlayerMySuffixUpdateComponent,
    resolve: {
      player: PlayerMySuffixRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(playerRoute)],
  exports: [RouterModule],
})
export class PlayerMySuffixRoutingModule {}
