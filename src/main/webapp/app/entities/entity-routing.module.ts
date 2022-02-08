import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'team-my-suffix',
        data: { pageTitle: 'scoreApp.team.home.title' },
        loadChildren: () => import('./team-my-suffix/team-my-suffix.module').then(m => m.TeamMySuffixModule),
      },
      {
        path: 'player-my-suffix',
        data: { pageTitle: 'scoreApp.player.home.title' },
        loadChildren: () => import('./player-my-suffix/player-my-suffix.module').then(m => m.PlayerMySuffixModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
