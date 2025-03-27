import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { VillanyoraAllas } from '../../../models/villanyora-allas.model';

@Component({
  selector: 'app-villanyora-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
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
