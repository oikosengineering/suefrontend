import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'procedureType'
})
export class ProcedureTypePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch(value){
      case 'building_procedure':
        return "Pratica edilizia";
      default:
        return value;
    }
  }

}
