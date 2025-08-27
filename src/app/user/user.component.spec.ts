import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

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

  it('should call getUser on init and assign users', () => {
    const mockUsers = [{ id: 1, userId: 1, title: 'User 1', completed: false }];
    userServiceSpy.getUser.and.returnValue(of(mockUsers));

    fixture.detectChanges(); // triggers ngOnInit

    expect(userServiceSpy.getUser).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should render users in the table', () => {
    const mockUsers = [
      { id: 1, userId: 1, title: 'User 1', completed: false },
      { id: 2, userId: 1, title: 'User 2', completed: true }
    ];
    userServiceSpy.getUser.and.returnValue(of(mockUsers));

    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const rows = compiled.querySelectorAll('table tr');

    // Expect header + 2 user rows
    expect(rows.length).toBe(3);

    // Verify first user row
    const firstRowCells = rows[1].querySelectorAll('td');
    expect(firstRowCells[0].textContent?.trim()).toBe('1');
    expect(firstRowCells[1].textContent?.trim()).toBe('User 1');
    expect(firstRowCells[2].textContent?.trim()).toBe('false');

    // Verify second user row
    const secondRowCells = rows[2].querySelectorAll('td');
    expect(secondRowCells[0].textContent?.trim()).toBe('2');
    expect(secondRowCells[1].textContent?.trim()).toBe('User 2');
    expect(secondRowCells[2].textContent?.trim()).toBe('true');
  });

  it('should render only header row when no users', () => {
    userServiceSpy.getUser.and.returnValue(of([]));

    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const rows = compiled.querySelectorAll('table tr');

    // Only header row should be present
    expect(rows.length).toBe(1);
  });
});