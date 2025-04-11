import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { VillanyoraAllas } from '../../../models/villanyora-allas.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-allasok-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
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
    this.allasok = [...data]; // Másolat, hogy ne írjuk felül direktben
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
