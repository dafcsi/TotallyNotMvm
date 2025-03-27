import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSorComponent } from './user-sor.component';

describe('UserSorComponent', () => {
  let component: UserSorComponent;
  let fixture: ComponentFixture<UserSorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
