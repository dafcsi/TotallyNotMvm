import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fogyasztas',
  standalone: true,
})
export class FogyasztasPipe implements PipeTransform {
  transform(allasok: { datum: Date; ertek: number }[]): number {
    if (!allasok || allasok.length < 2) {
      return 0;
    }
    
    // Sort by date to ensure correct calculation
    const sortedAllasok = [...allasok].sort((a, b) => {
      const dateA = a.datum instanceof Date ? a.datum : new Date(a.datum);
      const dateB = b.datum instanceof Date ? b.datum : new Date(b.datum);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Calculate the difference between first and last reading
    const elsoAllas = sortedAllasok[0].ertek;
    const utolsoAllas = sortedAllasok[sortedAllasok.length - 1].ertek;
    
    return utolsoAllas - elsoAllas;
  }
}