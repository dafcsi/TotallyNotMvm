import { Component, OnDestroy, OnInit } from '@angular/core';
import { Felhasznalo } from '../../models/felhasznalo.model';
import { MatDialog } from '@angular/material/dialog';
import { UserTableComponent } from './user-table/user-table.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AllasokModalComponent } from './allasok-modal/allasok-modal.component';
import { VillanyoraAllas } from '../../models/villanyora-allas.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from '../../services/firestore.service';
import { Subscription } from 'rxjs';
import { HighlightOnHoverDirective } from '../../shared/highlight-on-hover.directive';
import { TooltipDirective } from '../../shared/tooltip.directive';
import { KiemeltAllasPipe } from '../../shared/kiemelt-allas.pipe';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    UserTableComponent,
    HighlightOnHoverDirective,
    TooltipDirective,
    KiemeltAllasPipe
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  felhasznalok: Felhasznalo[] = [];
  loading = true;
  error: string | null = null;
  private subscriptions = new Subscription();

  // Stats for dashboard
  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;
  adminUsers = 0;
  regularUsers = 0;
  totalReadings = 0;
  latestReadingDate: Date | null = null;
  averageReading = 0;
  highestReading = 0;
  lowestReading = 0;

  isNaN = Number.isNaN;  // Add isNaN function to component

  constructor(
    private dialog: MatDialog,
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFelhasznalok();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadFelhasznalok(): void {
    this.loading = true;
    
    const sub = this.firestoreService.getAllUsers().subscribe({
      next: (users) => {
        this.felhasznalok = users;
        this.calculateStats();
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Hiba történt a felhasználók betöltése közben!';
        this.loading = false;
      }
    });
    
    this.subscriptions.add(sub);
  }

  // Calculate statistics for dashboard
  calculateStats(): void {
    this.totalUsers = this.felhasznalok.length;
    this.activeUsers = this.felhasznalok.filter(f => f.aktiv).length;
    this.inactiveUsers = this.felhasznalok.filter(f => !f.aktiv).length;
    this.adminUsers = this.felhasznalok.filter(f => f.szerepkor === 'admin').length;
    this.regularUsers = this.felhasznalok.filter(f => f.szerepkor === 'user').length;

    // Get all readings from the meter readings collection
    const sub = this.firestoreService.getHighMeterReadings(0).subscribe({
      next: (readings) => {
        this.totalReadings = readings.length;

        if (readings.length > 0) {
          // Find latest reading date - ensure we have valid dates
          const dates = readings
            .map(a => new Date(a.datum))
            .filter(date => !this.isNaN(date.getTime()));
          
          this.latestReadingDate = dates.length > 0 
            ? new Date(Math.max(...dates.map(d => d.getTime())))
            : null;
          
          // Calculate average, min, max
          const values = readings.map(a => a.ertek);
          this.averageReading = values.reduce((sum, val) => sum + val, 0) / values.length;
          this.highestReading = Math.max(...values);
          this.lowestReading = Math.min(...values);
        } else {
          this.latestReadingDate = null;
          this.averageReading = 0;
          this.highestReading = 0;
          this.lowestReading = 0;
        }
      },
      error: (err) => {
        console.error('Error loading meter readings:', err);
        this.error = 'Hiba történt a mérőállások betöltése közben!';
      }
    });

    this.subscriptions.add(sub);
  }

  refreshStats(): void {
    this.loadFelhasznalok();
  }

  modositFelhasznalo(f: Felhasznalo) {
    const ref = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: f,
    });

    ref.afterClosed().subscribe((val: Felhasznalo) => {
      if (val) {
        this.loading = true;
        
        const sub = this.firestoreService.updateUser(val.id, val).subscribe({
          next: () => {
            const index = this.felhasznalok.findIndex(u => u.id === val.id);
            if (index !== -1) {
              this.felhasznalok[index] = val;
            }
            this.calculateStats();
            this.loading = false;
            this.snackBar.open('Felhasználó sikeresen frissítve!', 'OK', {
              duration: 3000
            });
          },
          error: (err) => {
            console.error('Error updating user:', err);
            this.loading = false;
            this.snackBar.open('Hiba történt a felhasználó frissítése közben!', 'OK', {
              duration: 3000
            });
          }
        });
        
        this.subscriptions.add(sub);
      }
    });
  }

  torolFelhasznalo(id: string) {
    if (confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) {
      this.loading = true;
      
      const sub = this.firestoreService.deleteUser(id).subscribe({
        next: () => {
          this.felhasznalok = this.felhasznalok.filter(f => f.id !== id);
          this.calculateStats();
          this.loading = false;
          this.snackBar.open('Felhasználó sikeresen törölve!', 'OK', {
            duration: 3000
          });
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.loading = false;
          this.snackBar.open('Hiba történt a felhasználó törlése közben!', 'OK', {
            duration: 3000
          });
        }
      });
      
      this.subscriptions.add(sub);
    }
  }

  felszolitFelhasznalo(id: string) {
    const user = this.felhasznalok.find(f => f.id === id);
    if (user) {
      this.snackBar.open(`Felszólítás küldve: ${user.nev} (${user.email})`, 'OK', {
        duration: 3000
      });
    }
  }
  
  nyitAllasokModal(f: Felhasznalo) {
    const ref = this.dialog.open(AllasokModalComponent, {
      width: '600px',
      data: {
        userId: f.id,
        allasok: f.allasok
      }
    });
  
    ref.afterClosed().subscribe((modositottAllasok: VillanyoraAllas[]) => {
      if (modositottAllasok) {
        this.loading = true;
        
        // Create a copy of the user with updated readings
        const updatedUser = {...f, allasok: modositottAllasok};
        
        const sub = this.firestoreService.updateUser(f.id, updatedUser).subscribe({
          next: () => {
            const index = this.felhasznalok.findIndex(u => u.id === f.id);
            if (index !== -1) {
              this.felhasznalok[index].allasok = modositottAllasok;
            }
            this.calculateStats();
            this.loading = false;
            this.snackBar.open('Óraállások sikeresen frissítve!', 'OK', {
              duration: 3000
            });
          },
          error: (err) => {
            console.error('Error updating readings:', err);
            this.loading = false;
            this.snackBar.open('Hiba történt az óraállások frissítése közben!', 'OK', {
              duration: 3000
            });
          }
        });
        
        this.subscriptions.add(sub);
      }
    });
  }
  
  highlightTotalUsers(): string {
    return this.totalUsers > 10 ? '#e0f7fa' : 'transparent';
  }
}
