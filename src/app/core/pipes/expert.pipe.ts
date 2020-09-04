import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expertPipe'
})
export class ExpertPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if(value.creator){
      return value.creator.name ? value.creator.name : (value.creator.first_name + ' '+ value.creator.last_name);
    } else {
      return ''
    }
  }

}
