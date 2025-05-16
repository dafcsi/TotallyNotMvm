import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VillanyoraAllas } from '../../../models/villanyora-allas.model';
import { VillanyoraSorComponent } from '../villanyora-sor/villanyora-sor.component';
import { FogyasztasPipe } from '../../../shared/fogyasztas.pipe';
import { KiemeltAllasPipe } from '../../../shared/kiemelt-allas.pipe';
import { HighlightOnHoverDirective } from '../../../shared/highlight-on-hover.directive';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-villanyora-lista',
  standalone: true,
  imports: [
    CommonModule, 
    VillanyoraSorComponent,
    MaterialModule,
    FogyasztasPipe,
    KiemeltAllasPipe,
    HighlightOnHoverDirective
  ],
  templateUrl: './villanyora-lista.component.html',
  styleUrls: ['./villanyora-lista.component.scss'],
})
export class VillanyoraListaComponent {
  @Input() allasok: VillanyoraAllas[] = [];
  @Input() loading: boolean = false;
  @Input() errorMessage: string | null = null;
  
  @Output() deleteAllas = new EventEmitter<number>();
  @Output() refreshAllasok = new EventEmitter<void>();
  @Output() editAllas = new EventEmitter<{index: number, allas: VillanyoraAllas}>();
  
  onDeleteAllas(index: number): void {
    this.deleteAllas.emit(index);
  }
  
  onRefresh(): void {
    this.refreshAllasok.emit();
  }
  
  onEditAllas(index: number, allas: VillanyoraAllas): void {
    this.editAllas.emit({index, allas});
  }
}
