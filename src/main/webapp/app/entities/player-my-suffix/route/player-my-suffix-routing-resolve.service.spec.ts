import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPlayerMySuffix, PlayerMySuffix } from '../player-my-suffix.model';
import { PlayerMySuffixService } from '../service/player-my-suffix.service';

import { PlayerMySuffixRoutingResolveService } from './player-my-suffix-routing-resolve.service';

describe('PlayerMySuffix routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PlayerMySuffixRoutingResolveService;
  let service: PlayerMySuffixService;
  let resultPlayerMySuffix: IPlayerMySuffix | undefined;

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
    routingResolveService = TestBed.inject(PlayerMySuffixRoutingResolveService);
    service = TestBed.inject(PlayerMySuffixService);
    resultPlayerMySuffix = undefined;
  });

  describe('resolve', () => {
    it('should return IPlayerMySuffix returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPlayerMySuffix = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPlayerMySuffix).toEqual({ id: 123 });
    });

    it('should return new IPlayerMySuffix if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPlayerMySuffix = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPlayerMySuffix).toEqual(new PlayerMySuffix());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PlayerMySuffix })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPlayerMySuffix = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPlayerMySuffix).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
