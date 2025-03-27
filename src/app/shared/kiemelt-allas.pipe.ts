import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kiemeltAllas',
  standalone: true,
})
export class KiemeltAllasPipe implements PipeTransform {
  transform(ertek: number): string {
    if (ertek > 5000) {
      return '🔥 Figyelem!';
    } else {
      return '✅ OK';
    }
  }
}
