import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryPipe'
})
export class CategoryPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch (value) {
      case 'rottura_suolo':
        return 'Rottura Suolo Pubblico';
      case 'occupazione_suolo_edilizio':
        return 'Occupazione Suolo Edilizio';
      case 'occupazione_suolo_pubblico':
        return 'Occupazione Suolo Pubblico';
      case 'traslochi_lavori':
        return 'Occupazione Suolo Temporaneo (traslochi/lavori/...)';
      default:
        return value;
    }
  }

}
