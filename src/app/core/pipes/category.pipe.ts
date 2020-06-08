import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryPipe'
})
export class CategoryPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch(value){
      case 'rottura_suolo':
        return 'Rottura suolo pubblico';
      case 'occupazione_suolo_edilizio':
        return 'Occupazione suolo edilizio';
      case 'occupazione_suolo_pubblico':
        return 'Occupazione suolo pubblico';
      case 'traslochi_lavori':
        return 'Occupazione suolo tralochi-lavori';
      default:
        return value;
    }
  }

}
