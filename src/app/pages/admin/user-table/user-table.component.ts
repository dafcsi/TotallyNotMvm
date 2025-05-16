import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Felhasznalo } from '../../../models/felhasznalo.model';
import { InaktivFelhasznaloDirective } from '../../../shared/inaktiv-felhasznalo.directive';
import { DisableIfAdminDirective } from '../../../shared/disable-if-admin.directive';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule, 
    MaterialModule,
    InaktivFelhasznaloDirective,
    DisableIfAdminDirective
  ],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
  @Input() felhasznalok: Felhasznalo[] = [];

  @Output() torol = new EventEmitter<string>();
  @Output() felszolit = new EventEmitter<string>();
  @Output() modosit = new EventEmitter<Felhasznalo>();
  @Output() allasokMegnyitas = new EventEmitter<Felhasznalo>();

  displayedColumns: string[] = ['nev', 'email', 'szerepkor', 'műveletek'];

  onTorol(id: string) {
    this.torol.emit(id);
  }

  onFelszolit(id: string) {
    this.felszolit.emit(id);
  }

  onModosit(felhasznalo: Felhasznalo) {
    this.modosit.emit(felhasznalo);
  }
  
  onAllasokMegnyitas(felhasznalo: Felhasznalo) {
    this.allasokMegnyitas.emit(felhasznalo);
  }
}
