import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TeamMySuffixComponent } from './list/team-my-suffix.component';
import { TeamMySuffixDetailComponent } from './detail/team-my-suffix-detail.component';
import { TeamMySuffixUpdateComponent } from './update/team-my-suffix-update.component';
import { TeamMySuffixDeleteDialogComponent } from './delete/team-my-suffix-delete-dialog.component';
import { TeamMySuffixRoutingModule } from './route/team-my-suffix-routing.module';

@NgModule({
  imports: [SharedModule, TeamMySuffixRoutingModule],
  declarations: [TeamMySuffixComponent, TeamMySuffixDetailComponent, TeamMySuffixUpdateComponent, TeamMySuffixDeleteDialogComponent],
  entryComponents: [TeamMySuffixDeleteDialogComponent],
})
export class TeamMySuffixModule {}
