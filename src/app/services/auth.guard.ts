import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
    if (this.auth.isLoggedIn()) {
      return true;
    }
    
    // Ha nincs bejelentkezve, átirányítjuk a bejelentkezési oldalra
    alert('A lap megtekintéséhez be kell jelentkezned!');
    return this.router.parseUrl('/login');
  }
}