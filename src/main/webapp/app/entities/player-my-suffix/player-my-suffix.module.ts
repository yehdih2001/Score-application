import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PlayerMySuffixComponent } from './list/player-my-suffix.component';
import { PlayerMySuffixDetailComponent } from './detail/player-my-suffix-detail.component';
import { PlayerMySuffixUpdateComponent } from './update/player-my-suffix-update.component';
import { PlayerMySuffixDeleteDialogComponent } from './delete/player-my-suffix-delete-dialog.component';
import { PlayerMySuffixRoutingModule } from './route/player-my-suffix-routing.module';

@NgModule({
  imports: [SharedModule, PlayerMySuffixRoutingModule],
  declarations: [
    PlayerMySuffixComponent,
    PlayerMySuffixDetailComponent,
    PlayerMySuffixUpdateComponent,
    PlayerMySuffixDeleteDialogComponent,
  ],
  entryComponents: [PlayerMySuffixDeleteDialogComponent],
})
export class PlayerMySuffixModule {}
