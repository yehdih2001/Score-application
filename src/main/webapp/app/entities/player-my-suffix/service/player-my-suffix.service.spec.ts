import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPlayerMySuffix, PlayerMySuffix } from '../player-my-suffix.model';

import { PlayerMySuffixService } from './player-my-suffix.service';

describe('PlayerMySuffix Service', () => {
  let service: PlayerMySuffixService;
  let httpMock: HttpTestingController;
  let elemDefault: IPlayerMySuffix;
  let expectedResult: IPlayerMySuffix | IPlayerMySuffix[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlayerMySuffixService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      dateOfBirth: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateOfBirth: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PlayerMySuffix', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateOfBirth: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOfBirth: currentDate,
        },
        returnedFromService
      );

      service.create(new PlayerMySuffix()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PlayerMySuffix', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          dateOfBirth: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOfBirth: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PlayerMySuffix', () => {
      const patchObject = Object.assign({}, new PlayerMySuffix());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateOfBirth: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PlayerMySuffix', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          dateOfBirth: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOfBirth: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PlayerMySuffix', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPlayerMySuffixToCollectionIfMissing', () => {
      it('should add a PlayerMySuffix to an empty array', () => {
        const player: IPlayerMySuffix = { id: 123 };
        expectedResult = service.addPlayerMySuffixToCollectionIfMissing([], player);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(player);
      });

      it('should not add a PlayerMySuffix to an array that contains it', () => {
        const player: IPlayerMySuffix = { id: 123 };
        const playerCollection: IPlayerMySuffix[] = [
          {
            ...player,
          },
          { id: 456 },
        ];
        expectedResult = service.addPlayerMySuffixToCollectionIfMissing(playerCollection, player);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PlayerMySuffix to an array that doesn't contain it", () => {
        const player: IPlayerMySuffix = { id: 123 };
        const playerCollection: IPlayerMySuffix[] = [{ id: 456 }];
        expectedResult = service.addPlayerMySuffixToCollectionIfMissing(playerCollection, player);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(player);
      });

      it('should add only unique PlayerMySuffix to an array', () => {
        const playerArray: IPlayerMySuffix[] = [{ id: 123 }, { id: 456 }, { id: 27254 }];
        const playerCollection: IPlayerMySuffix[] = [{ id: 123 }];
        expectedResult = service.addPlayerMySuffixToCollectionIfMissing(playerCollection, ...playerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const player: IPlayerMySuffix = { id: 123 };
        const player2: IPlayerMySuffix = { id: 456 };
        expectedResult = service.addPlayerMySuffixToCollectionIfMissing([], player, player2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(player);
        expect(expectedResult).toContain(player2);
      });

      it('should accept null and undefined values', () => {
        const player: IPlayerMySuffix = { id: 123 };
        expectedResult = service.addPlayerMySuffixToCollectionIfMissing([], null, player, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(player);
      });

      it('should return initial array if no PlayerMySuffix is added', () => {
        const playerCollection: IPlayerMySuffix[] = [{ id: 123 }];
        expectedResult = service.addPlayerMySuffixToCollectionIfMissing(playerCollection, undefined, null);
        expect(expectedResult).toEqual(playerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
