import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITeamMySuffix, TeamMySuffix } from '../team-my-suffix.model';
import { TeamMySuffixService } from '../service/team-my-suffix.service';

import { TeamMySuffixRoutingResolveService } from './team-my-suffix-routing-resolve.service';

describe('TeamMySuffix routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TeamMySuffixRoutingResolveService;
  let service: TeamMySuffixService;
  let resultTeamMySuffix: ITeamMySuffix | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(TeamMySuffixRoutingResolveService);
    service = TestBed.inject(TeamMySuffixService);
    resultTeamMySuffix = undefined;
  });

  describe('resolve', () => {
    it('should return ITeamMySuffix returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTeamMySuffix = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTeamMySuffix).toEqual({ id: 123 });
    });

    it('should return new ITeamMySuffix if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTeamMySuffix = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTeamMySuffix).toEqual(new TeamMySuffix());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TeamMySuffix })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTeamMySuffix = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTeamMySuffix).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
