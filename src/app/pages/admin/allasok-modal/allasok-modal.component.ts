import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { VillanyoraAllas } from '../../../models/villanyora-allas.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-allasok-modal',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './allasok-modal.component.html',
  styleUrls: ['./allasok-modal.component.scss']
})
export class AllasokModalComponent {
  allasok: VillanyoraAllas[] = [];
  form: FormGroup;

  displayedColumns = ['datum', 'ertek', 'megjegyzes', 'torles'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: VillanyoraAllas[],
    private dialogRef: MatDialogRef<AllasokModalComponent>,
    private fb: FormBuilder
  ) {
    this.allasok = [...data];
    this.form = this.fb.group({
      ertek: [null, [Validators.required, Validators.min(0)]],
      megjegyzes: ['']
    });
  }

  hozzad(): void {
    if (this.form.valid) {
      this.allasok.push({
        datum: new Date(),
        ertek: this.form.value.ertek,
        megjegyzes: this.form.value.megjegyzes
      });
      this.form.reset();
    }
  }

  torol(index: number): void {
    this.allasok.splice(index, 1);
  }

  mentes(): void {
    this.dialogRef.close(this.allasok);
  }

  megsem(): void {
    this.dialogRef.close();
  }
}
