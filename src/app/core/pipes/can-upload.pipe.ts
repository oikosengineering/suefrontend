import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canUpload'
})
export class CanUploadPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): boolean {
    switch(value){
      case 'NEW':
        return true;
      case 'PROCESSED':
          return false;
      case 'PENDING':
        return true;
      case 'APPROVED':
        return false;
      case 'REJECTED':
        return true;
    }
  }

}
