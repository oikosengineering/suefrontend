import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canExtended'
})
export class CanExtendedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch(value){
      case true:
        return 'Sì';
      case false:
        return 'No';
    }
  }

}
