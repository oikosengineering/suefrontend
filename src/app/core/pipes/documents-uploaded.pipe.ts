import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentsUploaded'
})
export class DocumentsUploadedPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): unknown {
    switch(value){
      case true:
        return {icon: 'verified', tooltip: 'Tutti i documenti sono caricati', color: 'primary'};
      case false:
        return {icon: 'warning', tooltip: 'Mancano alcuni documenti', color: 'warn'};
    }
  }

}
