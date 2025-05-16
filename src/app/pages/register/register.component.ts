import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisableIfAdminDirective } from '../../shared/disable-if-admin.directive';
import { TooltipDirective } from '../../shared/tooltip.directive';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { Felhasznalo } from '../../models/felhasznalo.model';
import { MaterialModule } from '../../shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    DisableIfAdminDirective,
    TooltipDirective
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  loading = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nev: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', Validators.required],
      szerepkor: ['user', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('passwordConfirm');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      
      const newUser: Felhasznalo = {
        id: '', // Will be set by Firestore
        nev: this.registerForm.value.nev,
        email: this.registerForm.value.email,
        aktiv: true,
        szerepkor: this.registerForm.value.szerepkor,
        allasok: []
      };
      
      const sub = this.firestoreService.addUser(newUser).subscribe({
        next: (userId) => {
          // Update the user with the received ID
          newUser.id = userId;
          this.firestoreService.updateUser(userId, newUser).subscribe({
            next: () => {
              this.snackBar.open('Sikeres regisztráció!', 'OK', {
                duration: 3000,
                verticalPosition: 'top'
              });
              this.loading = false;
              this.router.navigate(['/login']);
            },
            error: (updateErr) => {
              console.error('Hiba a felhasználó ID frissítése során:', updateErr);
              this.snackBar.open('A regisztráció sikeres, de hiba történt az adatok frissítésekor!', 'OK', {
                duration: 3000,
                verticalPosition: 'top'
              });
              this.loading = false;
              this.router.navigate(['/login']);
            }
          });
        },
        error: (err) => {
          console.error('Hiba a regisztráció során:', err);
          this.snackBar.open('Hiba történt a regisztráció során!', 'OK', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.loading = false;
        }
      });
      
      this.subscription.add(sub);
    }
  }
}
