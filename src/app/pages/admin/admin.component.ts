import { Component } from '@angular/core';
import { Felhasznalo } from '../../models/felhasznalo.model';
import { MatCardModule } from '@angular/material/card';
import { UserTableComponent } from './user-table/user-table.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatCardModule, UserTableComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
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
    console.log('Módosítandó:', f);
  }

  torolFelhasznalo(id: string) {
    this.felhasznalok = this.felhasznalok.filter(f => f.id !== id);
  }

  felszolitFelhasznalo(id: string) {
    alert(`Felszólítás küldve a(z) ${id} azonosítójú felhasználónak.`);
  }
}
