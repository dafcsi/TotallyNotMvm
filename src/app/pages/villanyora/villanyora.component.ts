import { Component, OnDestroy, OnInit } from '@angular/core';
import { VillanyoraFormComponent } from './villanyora-form/villanyora-form.component';
import { VillanyoraListaComponent } from './villanyora-lista/villanyora-lista.component';
import { VillanyoraAllas } from '../../models/villanyora-allas.model';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FogyasztasPipe } from '../../shared/fogyasztas.pipe';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-villanyora',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    VillanyoraFormComponent, 
    VillanyoraListaComponent, 
    FogyasztasPipe
  ],
  templateUrl: './villanyora.component.html',
  styleUrls: ['./villanyora.component.scss'],
})
export class VillanyoraComponent implements OnInit, OnDestroy {
  allasok: VillanyoraAllas[] = [];
  loading = true;
  error: string | null = null;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllasok();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ujAllasErkezett(allas: VillanyoraAllas) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Nem vagy bejelentkezve!';
      return;
    }

    this.loading = true;
    const sub = this.firestoreService.addMeterReading(currentUser.id, allas)
      .subscribe({
        next: (readingId) => {
          // Add the ID to the reading before adding to local array
          this.allasok.push({
            ...allas,
            id: readingId
          });
          this.loading = false;
          this.error = null;
        },
        error: (err) => {
          console.error('Error adding meter reading:', err);
          this.error = 'Hiba történt az állás mentése közben!';
          this.loading = false;
        }
      });
    
    this.subscriptions.push(sub);
  }

  allasTorlese(index: number) {
    const allasToDelete = this.allasok[index];
    if (!allasToDelete.id) {
      console.error('No ID found for meter reading');
      this.error = 'Hiba történt az állás törlése közben!';
      return;
    }
    
    this.loading = true;
    const sub = this.firestoreService.deleteMeterReading(allasToDelete.id)
      .subscribe({
        next: () => {
          this.allasok.splice(index, 1);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting meter reading:', err);
          this.error = 'Hiba történt az állás törlése közben!';
          this.loading = false;
        }
      });
    
    this.subscriptions.push(sub);
  }

  // Módosítva publikusra a template-ből való eléréshez
  loadAllasok(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Nem vagy bejelentkezve!';
      this.loading = false;
      return;
    }

    const sub = this.firestoreService.getUserMeterReadings(currentUser.id)
      .subscribe({
        next: (readings) => {
          this.allasok = readings;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading meter readings:', err);
          this.error = 'Hiba történt az állások betöltése közben!';
          this.loading = false;
        }
      });
    
    this.subscriptions.push(sub);
  }
}
