import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe'
})
export class StatusPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch(value){
      case 'NEW':
        return {value: 'Nuova', color: '#3f51b5'};
      case 'PROCESSED':
          return {value: 'In eleborazione', color: '#FFD700'};
      case 'PENDING':
        return {value: 'In sospeso', color: '#FFA500'};
      case 'APPROVED':
        return {value: 'Approvata', color: '#228B22'};
      case 'REJECTED':
        return {value: 'Respinta', color: '#f44336'};
      case 'EXTENSION_REQUESTED':
        return {value: 'Richiesta proroga', color: '#fb9bfb'}
    }
  }

}
