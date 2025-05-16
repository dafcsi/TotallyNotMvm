import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Felhasznalo } from '../../models/felhasznalo.model';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user$: Observable<Felhasznalo | null>;
  isDark = false;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.getLoggedInUser();
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark-mode');
  }

  logout() {
    this.auth.logout();
  }
}