import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TeamMySuffixService } from '../service/team-my-suffix.service';
import { ITeamMySuffix, TeamMySuffix } from '../team-my-suffix.model';

import { TeamMySuffixUpdateComponent } from './team-my-suffix-update.component';

describe('TeamMySuffix Management Update Component', () => {
  let comp: TeamMySuffixUpdateComponent;
  let fixture: ComponentFixture<TeamMySuffixUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let teamService: TeamMySuffixService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TeamMySuffixUpdateComponent],
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
      .overrideTemplate(TeamMySuffixUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TeamMySuffixUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    teamService = TestBed.inject(TeamMySuffixService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const team: ITeamMySuffix = { id: 456 };

      activatedRoute.data = of({ team });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(team));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TeamMySuffix>>();
      const team = { id: 123 };
      jest.spyOn(teamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ team });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: team }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(teamService.update).toHaveBeenCalledWith(team);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TeamMySuffix>>();
      const team = new TeamMySuffix();
      jest.spyOn(teamService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ team });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: team }));
      saveSubject.complete();

      // THEN
      expect(teamService.create).toHaveBeenCalledWith(team);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TeamMySuffix>>();
      const team = { id: 123 };
      jest.spyOn(teamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ team });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(teamService.update).toHaveBeenCalledWith(team);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
