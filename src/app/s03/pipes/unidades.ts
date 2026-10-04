import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unidades',
  standalone: true
})
export class UnidadesPipe implements PipeTransform {
  transform(cantidad: number): string {
    if (cantidad === 0) {
      return 'sin existencias';
    } else if (cantidad === 1) {
      return '1 unidad';
    } else {
      return `${cantidad} unidades`;
    }
  }
}