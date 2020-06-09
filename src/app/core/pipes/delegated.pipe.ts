import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'delegatedPipe'
})
export class DelegatedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch(value){
      case true:
        return 'Con delega';
      case false:
        return 'Senza delega';
    }
  }

}
