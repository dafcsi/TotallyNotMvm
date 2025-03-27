import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillanyoraListaComponent } from './villanyora-lista.component';

describe('VillanyoraListaComponent', () => {
  let component: VillanyoraListaComponent;
  let fixture: ComponentFixture<VillanyoraListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillanyoraListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillanyoraListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
