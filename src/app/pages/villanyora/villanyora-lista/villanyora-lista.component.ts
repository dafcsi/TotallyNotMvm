import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VillanyoraAllas } from '../../../models/villanyora-allas.model';
import { VillanyoraSorComponent } from '../villanyora-sor/villanyora-sor.component';

@Component({
  selector: 'app-villanyora-lista',
  standalone: true,
  imports: [CommonModule, VillanyoraSorComponent],
  templateUrl: './villanyora-lista.component.html',
  styleUrls: ['./villanyora-lista.component.scss'],
})
export class VillanyoraListaComponent {
  @Input() allasok: VillanyoraAllas[] = [];
}
