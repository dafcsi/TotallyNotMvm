import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HighlightOnHoverDirective } from '../../shared/highlight-on-hover.directive';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    HighlightOnHoverDirective
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      const loginSub = this.auth.login(email, password).subscribe({
        next: (success) => {
          if (success) {
            this.snackBar.open("Sikeres bejelentkezés!", "OK", {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.router.navigate(['/']); // irány vissza a főoldalra
          } else {
            this.snackBar.open("Sikertelen bejelentkezés!", "OK", {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
          this.loading = false;
        },
        error: (err) => {
          console.error("Hiba a bejelentkezés során:", err);
          this.snackBar.open("Hiba történt a bejelentkezés során!", "OK", {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.loading = false;
        }
      });

      this.subscription.add(loginSub);
    }
  }
}
