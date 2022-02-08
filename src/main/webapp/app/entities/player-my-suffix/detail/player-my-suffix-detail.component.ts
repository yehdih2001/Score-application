import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlayerMySuffix } from '../player-my-suffix.model';

@Component({
  selector: 'jhi-player-my-suffix-detail',
  templateUrl: './player-my-suffix-detail.component.html',
})
export class PlayerMySuffixDetailComponent implements OnInit {
  player: IPlayerMySuffix | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ player }) => {
      this.player = player;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
