import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtensions'
})
export class FileExtensionsPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch(value.toLowerCase()){
      case 'pdf':
        return "file-pdf";
      case 'p7m':
        return "file-signature";
      case 'xls':
      case 'xlsx':
      case 'ods':
        return "file-excel"
      case 'mp3':
      case 'mpeg3': 
      case 'ogg':
      case 'wav':
        return "file-audio";
      case 'avi': 
      case 'mpeg':
      case 'wmv':
      case 'mp4':
      case '3gp':
      case 'flv':
        return "file-video";
      case 'txt':
        return "file-alt"
      case 'doc':
      case 'docx':
      case 'odt':
        return "file-word";
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'bmp':
      case 'gif':
      case 'psd':
      case 'svg':
        return "file-image";
      case 'json':
      case 'php':
      case 'ts':
      case 'js':
      case 'css':
      case 'scss':
      case 'html':
        return "file-code";
      default:
        return "file";
    }
  }

}
