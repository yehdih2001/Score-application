import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITeamMySuffix } from '../team-my-suffix.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-team-my-suffix-detail',
  templateUrl: './team-my-suffix-detail.component.html',
})
export class TeamMySuffixDetailComponent implements OnInit {
  team: ITeamMySuffix | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ team }) => {
      this.team = team;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
