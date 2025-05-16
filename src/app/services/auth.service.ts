import { Injectable } from '@angular/core';
import { Felhasznalo } from '../models/felhasznalo.model';
import { BehaviorSubject, Observable, from, of, switchMap, map, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'currentUser';
  private readonly user$ = new BehaviorSubject<Felhasznalo | null>(this.getStoredUser());

  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    // Inicializáláskor ellenőrizzük a tárolt felhasználót
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.validateStoredUser(storedUser);
    }
  }

  private getStoredUser(): Felhasznalo | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  private setStoredUser(user: Felhasznalo | null): void {
    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private validateStoredUser(user: Felhasznalo): void {
    // Ellenőrizzük, hogy a felhasználó még létezik-e a Firebase-ben
    this.firestoreService.getUserById(user.id).subscribe({
      next: (dbUser) => {
        if (!dbUser) {
          // Ha a felhasználó már nem létezik, kijelentkeztetjük
          this.logout();
        } else {
          // Frissítjük a helyi adatokat a Firebase-ből
          this.user$.next(dbUser);
          this.setStoredUser(dbUser);
        }
      },
      error: () => this.logout()
    });
  }

  login(email: string, password: string): Observable<boolean> {
    // Először keressük meg a felhasználót email alapján
    return this.firestoreService.getAllUsers().pipe(
      map(users => users.find(u => u.email === email)),
      switchMap(existingUser => {
        if (existingUser) {
          // Ha létezik a felhasználó, frissítjük a helyi állapotot
          this.user$.next(existingUser);
          this.setStoredUser(existingUser);
          return of(true);
        } else {
          // Ha nem létezik, létrehozunk egy újat
          const szerepkor = email.includes('admin') ? 'admin' : 'user';
          const newUser: Felhasznalo = {
            id: crypto.randomUUID(),
            nev: email.split('@')[0],
            email,
            aktiv: true,
            szerepkor: szerepkor as 'admin' | 'user',
            allasok: []
          };

          return this.firestoreService.addUser(newUser).pipe(
            map(userId => {
              const userWithId = {...newUser, id: userId};
              this.user$.next(userWithId);
              this.setStoredUser(userWithId);
              return true;
            })
          );
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    this.setStoredUser(null);
    this.router.navigate(['/login']);
  }

  getLoggedInUser(): Observable<Felhasznalo | null> {
    return this.user$.asObservable();
  }

  getCurrentUser(): Felhasznalo | null {
    return this.user$.value;
  }

  isLoggedIn(): boolean {
    return !!this.user$.value;
  }

  isAdmin(): boolean {
    const user = this.user$.value;
    return !!user && user.szerepkor === 'admin';
  }
}
