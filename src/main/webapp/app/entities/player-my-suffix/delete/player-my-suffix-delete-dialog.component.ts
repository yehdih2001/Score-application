import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlayerMySuffix } from '../player-my-suffix.model';
import { PlayerMySuffixService } from '../service/player-my-suffix.service';

@Component({
  templateUrl: './player-my-suffix-delete-dialog.component.html',
})
export class PlayerMySuffixDeleteDialogComponent {
  player?: IPlayerMySuffix;

  constructor(protected playerService: PlayerMySuffixService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.playerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
