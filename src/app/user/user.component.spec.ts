import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { delay, of } from 'rxjs';

import { UserComponent } from './user.component';
import { UserService } from '../shared/user.service';

describe('UserComponent', () => {
  let fixture: ComponentFixture<UserComponent>;
  let component: UserComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Create a spy for UserService
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['getUser']);
    userServiceSpy.getUser.and.returnValue(of([])); // default empty response

    await TestBed.configureTestingModule({
      imports: [UserComponent], // standalone component
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getUser on init and assign users (waitForAsync)', waitForAsync(() => {
    const mockUsers = [{ id: 1, userId: 1, title: 'User 1', completed: false }];
    userServiceSpy.getUser.and.returnValue(of(mockUsers).pipe(delay(0))); // async observable

    fixture.detectChanges(); // triggers ngOnInit

    fixture.whenStable().then(() => {
      expect(userServiceSpy.getUser).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
    });
  }));

  it('should call getUser on init and assign users (fakeAsync)', fakeAsync(() => {
    const mockUsers = [{ id: 1, title: 'User 1', completed: false }];
    userServiceSpy.getUser.and.returnValue(of(mockUsers).pipe(delay(1000)));

    fixture.detectChanges(); // triggers ngOnInit
    expect(component.users).toEqual([]); // not yet assigned

    tick(1000); // simulate passage of time
    fixture.detectChanges();

    expect(userServiceSpy.getUser).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  }));
});