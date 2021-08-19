import { TestBed } from '@angular/core/testing';

import { UserReservationsService } from './user-reservations.service';

describe('UserReservationsService', () => {
  let service: UserReservationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserReservationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
