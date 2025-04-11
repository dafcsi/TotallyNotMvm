import { Injectable } from '@angular/core';
import { Felhasznalo } from '../models/felhasznalo.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly user$ = new BehaviorSubject<Felhasznalo | null>(null);

  login(email: string, password: string): boolean {
    const szerepkor = email.includes('admin') ? 'admin' : 'user';

    const user: Felhasznalo = {
      id: crypto.randomUUID(), // generál véletlen id-t
      nev: email.split('@')[0], // pl. "teszt" vagy "admin"
      email,
      aktiv: true,
      szerepkor: szerepkor as 'admin' | 'user',
      allasok: []
    };

    this.user$.next(user);
    return true;
  }

  logout(): void {
    this.user$.next(null);
  }

  getLoggedInUser() {
    return this.user$.asObservable();
  }

  getCurrentUser() {
    return this.user$.value;
  }
}
