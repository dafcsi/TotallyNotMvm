import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillanyoraSorComponent } from './villanyora-sor.component';

describe('VillanyoraSorComponent', () => {
  let component: VillanyoraSorComponent;
  let fixture: ComponentFixture<VillanyoraSorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillanyoraSorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillanyoraSorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
