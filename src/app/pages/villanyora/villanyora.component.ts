import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { VillanyoraFormComponent } from './villanyora-form/villanyora-form.component';
import { VillanyoraListaComponent } from './villanyora-lista/villanyora-lista.component';
import { VillanyoraAllas } from '../../models/villanyora-allas.model';

@Component({
  selector: 'app-villanyora',
  standalone: true,
  imports: [MatCardModule, VillanyoraFormComponent, VillanyoraListaComponent],
  templateUrl: './villanyora.component.html',
  styleUrls: ['./villanyora.component.scss'],
})
export class VillanyoraComponent {
  allasok: VillanyoraAllas[] = [];

  ujAllasErkezett(allas: VillanyoraAllas) {
    this.allasok.push(allas);
  }
}
