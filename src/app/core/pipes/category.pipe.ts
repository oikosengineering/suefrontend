import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryPipe'
})
export class CategoryPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch(value){
      case 'rottura_suolo':
        return 'Rottura suolo';
      default:
        return value;
    }
  }

}
