import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VillanyoraAllas } from '../../../models/villanyora-allas.model';
import { KiemeltAllasPipe } from '../../../shared/kiemelt-allas.pipe';
import { HighlightOnHoverDirective } from '../../../shared/highlight-on-hover.directive';
import { TooltipDirective } from '../../../shared/tooltip.directive';
import { DisableIfAdminDirective } from '../../../shared/disable-if-admin.directive';
import { InaktivFelhasznaloDirective } from '../../../shared/inaktiv-felhasznalo.directive';
import { AuthService } from '../../../services/auth.service';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-villanyora-sor',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    KiemeltAllasPipe,
    HighlightOnHoverDirective,
    TooltipDirective,
    DisableIfAdminDirective,
    InaktivFelhasznaloDirective
  ],
  templateUrl: './villanyora-sor.component.html',
  styleUrls: ['./villanyora-sor.component.scss'],
})
export class VillanyoraSorComponent {
  private _allas!: VillanyoraAllas;

  get allas(): VillanyoraAllas {
    return this._allas;
  }

  @Input() set allas(value: VillanyoraAllas) {
    if (value.datum && typeof value.datum === 'object' && 'seconds' in value.datum) {
      const timestamp = value.datum as any;
      this._allas = {
        ...value,
        datum: new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000)
      };
    } else {
      this._allas = value;
    }
  }
  
  @Input() index: number = 0;
  @Input() isLast: boolean = false;
  
  @Output() deleteClick = new EventEmitter<number>();
  @Output() editClick = new EventEmitter<VillanyoraAllas>();
  
  isAdmin = false;
  isActive = true;
  
  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.szerepkor === 'admin';
    this.isActive = user?.aktiv || false;
  }
  
  onDelete(): void {
    this.deleteClick.emit(this.index);
  }
  
  onEdit(): void {
    this.editClick.emit(this.allas);
  }
  
  getTooltipText(): string {
    return `Óraállás értéke: ${this.allas.ertek} kWh`;
  }
}
