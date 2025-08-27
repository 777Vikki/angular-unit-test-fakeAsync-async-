import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch first 10 users', () => {
    const mockUsers = Array.from({length: 20}, (_, i) => ({id: i+1, userId: i+1, completed: i%5 === 0, title: `delectus aut autem ${i+1}`}))
    service.getUser().subscribe(users => {
      expect(users.length).toBe(10);
      expect(users[0].id).toBe(1);
      expect(users[9].id).toBe(10);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
