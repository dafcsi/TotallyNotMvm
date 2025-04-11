import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Felhasznalo } from '../../models/felhasznalo.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
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