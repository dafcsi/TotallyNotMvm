import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Felhasznalo } from '../../../models/felhasznalo.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
  @Input() felhasznalok: Felhasznalo[] = [];

  @Output() torol = new EventEmitter<string>();
  @Output() felszolit = new EventEmitter<string>();
  @Output() modosit = new EventEmitter<Felhasznalo>();

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
}
