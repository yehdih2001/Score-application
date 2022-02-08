import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPlayerMySuffix, PlayerMySuffix } from '../player-my-suffix.model';
import { PlayerMySuffixService } from '../service/player-my-suffix.service';
import { ITeamMySuffix } from 'app/entities/team-my-suffix/team-my-suffix.model';
import { TeamMySuffixService } from 'app/entities/team-my-suffix/service/team-my-suffix.service';

@Component({
  selector: 'jhi-player-my-suffix-update',
  templateUrl: './player-my-suffix-update.component.html',
})
export class PlayerMySuffixUpdateComponent implements OnInit {
  isSaving = false;

  teamsSharedCollection: ITeamMySuffix[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    dateOfBirth: [],
    actualTeam: [],
  });

  constructor(
    protected playerService: PlayerMySuffixService,
    protected teamService: TeamMySuffixService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ player }) => {
      if (player.id === undefined) {
        const today = dayjs().startOf('day');
        player.dateOfBirth = today;
      }

      this.updateForm(player);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const player = this.createFromForm();
    if (player.id !== undefined) {
      this.subscribeToSaveResponse(this.playerService.update(player));
    } else {
      this.subscribeToSaveResponse(this.playerService.create(player));
    }
  }

  trackTeamMySuffixById(index: number, item: ITeamMySuffix): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlayerMySuffix>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(player: IPlayerMySuffix): void {
    this.editForm.patchValue({
      id: player.id,
      name: player.name,
      dateOfBirth: player.dateOfBirth ? player.dateOfBirth.format(DATE_TIME_FORMAT) : null,
      actualTeam: player.actualTeam,
    });

    this.teamsSharedCollection = this.teamService.addTeamMySuffixToCollectionIfMissing(this.teamsSharedCollection, player.actualTeam);
  }

  protected loadRelationshipsOptions(): void {
    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeamMySuffix[]>) => res.body ?? []))
      .pipe(
        map((teams: ITeamMySuffix[]) =>
          this.teamService.addTeamMySuffixToCollectionIfMissing(teams, this.editForm.get('actualTeam')!.value)
        )
      )
      .subscribe((teams: ITeamMySuffix[]) => (this.teamsSharedCollection = teams));
  }

  protected createFromForm(): IPlayerMySuffix {
    return {
      ...new PlayerMySuffix(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      dateOfBirth: this.editForm.get(['dateOfBirth'])!.value
        ? dayjs(this.editForm.get(['dateOfBirth'])!.value, DATE_TIME_FORMAT)
        : undefined,
      actualTeam: this.editForm.get(['actualTeam'])!.value,
    };
  }
}
