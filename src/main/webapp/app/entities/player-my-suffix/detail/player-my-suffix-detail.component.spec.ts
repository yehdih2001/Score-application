import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PlayerMySuffixDetailComponent } from './player-my-suffix-detail.component';

describe('PlayerMySuffix Management Detail Component', () => {
  let comp: PlayerMySuffixDetailComponent;
  let fixture: ComponentFixture<PlayerMySuffixDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerMySuffixDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ player: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PlayerMySuffixDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PlayerMySuffixDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load player on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.player).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
