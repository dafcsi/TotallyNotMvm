import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.getLoggedInUser().pipe(
      take(1),
      map(user => {
        // Használjuk az AuthService isAdmin() metódusát
        if (this.auth.isAdmin()) {
          return true;
        }
        
        // Ha nem admin, átirányítjuk a főoldalra
        alert('Csak admin felhasználók számára engedélyezett!');
        return this.router.parseUrl('/');
      })
    );
  }
}