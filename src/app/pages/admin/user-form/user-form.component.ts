import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Felhasznalo } from '../../../models/felhasznalo.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Felhasznalo
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nev: [this.data.nev, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      szerepkor: [this.data.szerepkor, Validators.required],
      aktiv: [this.data.aktiv]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const modositott = { ...this.data, ...this.form.value };
      this.dialogRef.close(modositott);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
