import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { VillanyoraAllas } from '../../../models/villanyora-allas.model';
import { KiemeltAllasPipe } from '../../../shared/kiemelt-allas.pipe';

@Component({
  selector: 'app-villanyora-sor',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule,KiemeltAllasPipe ],
  templateUrl: './villanyora-sor.component.html',
  styleUrls: ['./villanyora-sor.component.scss'],
})
export class VillanyoraSorComponent {
  @Input() allas!: VillanyoraAllas;
}
