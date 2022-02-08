import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITeamMySuffix, TeamMySuffix } from '../team-my-suffix.model';

import { TeamMySuffixService } from './team-my-suffix.service';

describe('TeamMySuffix Service', () => {
  let service: TeamMySuffixService;
  let httpMock: HttpTestingController;
  let elemDefault: ITeamMySuffix;
  let expectedResult: ITeamMySuffix | ITeamMySuffix[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TeamMySuffixService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      pictureContentType: 'image/png',
      picture: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TeamMySuffix', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TeamMySuffix()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TeamMySuffix', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          picture: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TeamMySuffix', () => {
      const patchObject = Object.assign({}, new TeamMySuffix());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TeamMySuffix', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          picture: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a TeamMySuffix', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTeamMySuffixToCollectionIfMissing', () => {
      it('should add a TeamMySuffix to an empty array', () => {
        const team: ITeamMySuffix = { id: 123 };
        expectedResult = service.addTeamMySuffixToCollectionIfMissing([], team);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(team);
      });

      it('should not add a TeamMySuffix to an array that contains it', () => {
        const team: ITeamMySuffix = { id: 123 };
        const teamCollection: ITeamMySuffix[] = [
          {
            ...team,
          },
          { id: 456 },
        ];
        expectedResult = service.addTeamMySuffixToCollectionIfMissing(teamCollection, team);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TeamMySuffix to an array that doesn't contain it", () => {
        const team: ITeamMySuffix = { id: 123 };
        const teamCollection: ITeamMySuffix[] = [{ id: 456 }];
        expectedResult = service.addTeamMySuffixToCollectionIfMissing(teamCollection, team);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(team);
      });

      it('should add only unique TeamMySuffix to an array', () => {
        const teamArray: ITeamMySuffix[] = [{ id: 123 }, { id: 456 }, { id: 43062 }];
        const teamCollection: ITeamMySuffix[] = [{ id: 123 }];
        expectedResult = service.addTeamMySuffixToCollectionIfMissing(teamCollection, ...teamArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const team: ITeamMySuffix = { id: 123 };
        const team2: ITeamMySuffix = { id: 456 };
        expectedResult = service.addTeamMySuffixToCollectionIfMissing([], team, team2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(team);
        expect(expectedResult).toContain(team2);
      });

      it('should accept null and undefined values', () => {
        const team: ITeamMySuffix = { id: 123 };
        expectedResult = service.addTeamMySuffixToCollectionIfMissing([], null, team, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(team);
      });

      it('should return initial array if no TeamMySuffix is added', () => {
        const teamCollection: ITeamMySuffix[] = [{ id: 123 }];
        expectedResult = service.addTeamMySuffixToCollectionIfMissing(teamCollection, undefined, null);
        expect(expectedResult).toEqual(teamCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
