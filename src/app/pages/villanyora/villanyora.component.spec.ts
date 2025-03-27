import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillanyoraComponent } from './villanyora.component';

describe('VillanyoraComponent', () => {
  let component: VillanyoraComponent;
  let fixture: ComponentFixture<VillanyoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillanyoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillanyoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
