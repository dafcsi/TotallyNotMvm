import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllasokModalComponent } from './allasok-modal.component';

describe('AllasokModalComponent', () => {
  let component: AllasokModalComponent;
  let fixture: ComponentFixture<AllasokModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllasokModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllasokModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
