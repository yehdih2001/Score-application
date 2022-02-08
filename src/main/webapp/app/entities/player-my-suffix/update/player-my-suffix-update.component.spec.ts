import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlayerMySuffixService } from '../service/player-my-suffix.service';
import { IPlayerMySuffix, PlayerMySuffix } from '../player-my-suffix.model';
import { ITeamMySuffix } from 'app/entities/team-my-suffix/team-my-suffix.model';
import { TeamMySuffixService } from 'app/entities/team-my-suffix/service/team-my-suffix.service';

import { PlayerMySuffixUpdateComponent } from './player-my-suffix-update.component';

describe('PlayerMySuffix Management Update Component', () => {
  let comp: PlayerMySuffixUpdateComponent;
  let fixture: ComponentFixture<PlayerMySuffixUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let playerService: PlayerMySuffixService;
  let teamService: TeamMySuffixService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlayerMySuffixUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PlayerMySuffixUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlayerMySuffixUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    playerService = TestBed.inject(PlayerMySuffixService);
    teamService = TestBed.inject(TeamMySuffixService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TeamMySuffix query and add missing value', () => {
      const player: IPlayerMySuffix = { id: 456 };
      const actualTeam: ITeamMySuffix = { id: 84065 };
      player.actualTeam = actualTeam;

      const teamCollection: ITeamMySuffix[] = [{ id: 81969 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeamMySuffixes = [actualTeam];
      const expectedCollection: ITeamMySuffix[] = [...additionalTeamMySuffixes, ...teamCollection];
      jest.spyOn(teamService, 'addTeamMySuffixToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ player });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamMySuffixToCollectionIfMissing).toHaveBeenCalledWith(teamCollection, ...additionalTeamMySuffixes);
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const player: IPlayerMySuffix = { id: 456 };
      const actualTeam: ITeamMySuffix = { id: 68928 };
      player.actualTeam = actualTeam;

      activatedRoute.data = of({ player });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(player));
      expect(comp.teamsSharedCollection).toContain(actualTeam);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PlayerMySuffix>>();
      const player = { id: 123 };
      jest.spyOn(playerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ player });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: player }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(playerService.update).toHaveBeenCalledWith(player);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PlayerMySuffix>>();
      const player = new PlayerMySuffix();
      jest.spyOn(playerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ player });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: player }));
      saveSubject.complete();

      // THEN
      expect(playerService.create).toHaveBeenCalledWith(player);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PlayerMySuffix>>();
      const player = { id: 123 };
      jest.spyOn(playerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ player });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(playerService.update).toHaveBeenCalledWith(player);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTeamMySuffixById', () => {
      it('Should return tracked TeamMySuffix primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTeamMySuffixById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
