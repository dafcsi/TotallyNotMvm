import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VillanyoraAllas } from '../../../models/villanyora-allas.model';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-villanyora-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './villanyora-form.component.html',
  styleUrls: ['./villanyora-form.component.scss']
})
export class VillanyoraFormComponent implements OnInit {
  @Output() ujAllas = new EventEmitter<VillanyoraAllas>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      ertek: [null, [Validators.required, Validators.min(0)]],
      megjegyzes: ['']
    });
  }

  bekuld(): void {
    if (this.form.valid) {
      const allas: VillanyoraAllas = {
        datum: new Date(),
        ertek: this.form.value.ertek,
        megjegyzes: this.form.value.megjegyzes
      };
      this.ujAllas.emit(allas);
      this.form.reset();
    }
  }
}
