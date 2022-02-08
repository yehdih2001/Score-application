import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeamMySuffix } from '../team-my-suffix.model';
import { TeamMySuffixService } from '../service/team-my-suffix.service';

@Component({
  templateUrl: './team-my-suffix-delete-dialog.component.html',
})
export class TeamMySuffixDeleteDialogComponent {
  team?: ITeamMySuffix;

  constructor(protected teamService: TeamMySuffixService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.teamService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
