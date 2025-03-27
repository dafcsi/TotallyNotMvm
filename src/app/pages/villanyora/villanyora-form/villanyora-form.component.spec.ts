import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillanyoraFormComponent } from './villanyora-form.component';

describe('VillanyoraFormComponent', () => {
  let component: VillanyoraFormComponent;
  let fixture: ComponentFixture<VillanyoraFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillanyoraFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillanyoraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
