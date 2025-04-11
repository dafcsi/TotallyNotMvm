import { Component } from '@angular/core';
import { Felhasznalo } from '../../models/felhasznalo.model';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserTableComponent } from './user-table/user-table.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AllasokModalComponent } from './allasok-modal/allasok-modal.component';
import { VillanyoraAllas } from '../../models/villanyora-allas.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatCardModule,
    MatDialogModule,
    UserTableComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(private dialog: MatDialog) {}

  felhasznalok: Felhasznalo[] = [
    {
      id: '1',
      nev: 'Teszt Elek',
      email: 'teszt@totallynotmvm.hu',
      aktiv: true,
      szerepkor: 'user',
      allasok: []
    },
    {
      id: '2',
      nev: 'Admin Aladár',
      email: 'admin@totallynotmvm.hu',
      aktiv: true,
      szerepkor: 'admin',
      allasok: []
    }
  ];

  modositFelhasznalo(f: Felhasznalo) {
    const ref = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: f,
    });

    ref.afterClosed().subscribe((val: Felhasznalo) => {
      if (val) {
        const index = this.felhasznalok.findIndex(u => u.id === val.id);
        if (index !== -1) {
          this.felhasznalok[index] = val;
        }
      }
    });
  }

  torolFelhasznalo(id: string) {
    this.felhasznalok = this.felhasznalok.filter(f => f.id !== id);
  }

  felszolitFelhasznalo(id: string) {
    alert(`Felszólítás küldve a(z) ${id} azonosítójú felhasználónak.`);
  }
  
  nyitAllasokModal(f: Felhasznalo) {
    const ref = this.dialog.open(AllasokModalComponent, {
      width: '600px',
      data: f.allasok
    });
  
    ref.afterClosed().subscribe((modositottAllasok: VillanyoraAllas[]) => {
      if (modositottAllasok) {
        const index = this.felhasznalok.findIndex(u => u.id === f.id);
        if (index !== -1) {
          this.felhasznalok[index].allasok = modositottAllasok;
        }
      }
    });
  }
}
