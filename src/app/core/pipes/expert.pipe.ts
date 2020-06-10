import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expertPipe'
})
export class ExpertPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if(value.experts && value.experts.length > 0){
      return value.experts[0].name ? value.experts[0].name : (value.experts[0].first_name + ' '+ value.experts[0].last_name);
    } else {
      return ''
    }
  }

}
