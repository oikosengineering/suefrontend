import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { createTransformFromCoordinateTransform } from 'ol/proj';
import { Country, Province, City, Document, Procedure, ListaPratiche, Expert, Extension } from '../models/models';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppApiService {
  header = { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'} };
  constructor(
    private httpClient: HttpClient,
  ) { }

  /*
  GET dati base
  */

  getNazioni() {
    return this.httpClient.get(environment.api_url + '/getListaNazioni', this.header).pipe(map((response)  => response));
  }

  getProvince() {
    return this.httpClient.get(environment.api_url + '/getListaProvince', this.header).pipe(map((response) => response));
  }

  getComuni(code: string) {
    return this.httpClient.get(environment.api_url + '/getListaComuni?id=' + code, this.header).pipe(map((response) => response));
  }

  getTitoliProfessionali() {
    return this.httpClient.get(environment.api_url + '/getListaTitoliProfessionali', this.header).pipe(map(response => response));
  }

  getDizionario(cat: string) {
    return this.httpClient.get(environment.api_url + '/getDizionario?cat=' + cat, this.header).pipe(map(response => response));
  }

  /*
  GET PRATICA
  */

  creaPratica(department: string, body: any) {
    const header = { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } };
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post(environment.api_url + '/creaPratica?department=' + department, body, header).pipe(map(response => response));
  }

  creaProroga(department: string, id: string, body: any): Observable<Procedure> {
    const header = { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } };
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post(environment.api_url + '/creaProroga?department=' + department + '&id=' + id, body, header).pipe(map(response => response));
  }

  getDettagliPratica(department: string, id: string): Observable<Procedure> {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get(environment.api_url + '/getDettagliPratica?department=' + department + '&id=' + id, this.header).pipe(map(response => response));
  }

  getDettagliProroga(department: string, id: string, relatedid: string): Observable<Extension> {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<Extension>(environment.api_url + '/getDettagliProroga?department=' + department + '&id=' + id + '&relatedid=' + relatedid, this.header).pipe(map(response => response));
  }

  modificaDettaglioPratica(department: string, id: string, body: any): Observable<Procedure> {
    const header = { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } };
    // tslint:disable-next-line: max-line-length
    return this.httpClient.patch(environment.api_url + '/modificaDettaglioPratica/department=' + department + '&id=' + id, body, header).pipe(map(response => response));
  }

  getDocumentiPratica(department: string, id: string): Observable<Document[]> {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<Document[]>(environment.api_url + '/getDocumentiPratica?department=' + department + '&id=' + id, this.header).pipe(map(response => response));
  }

  getListaDocumentiObbligatoriPratica(department: string, category: string): Observable<Document[]> {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<Document[]>(environment.api_url + '/getListaDocumentiObbligatoriPratica?department=' + department + '&category=' + category, this.header).pipe(map(response => response));
  }

  getListaPratiche(department: string, uuid: string) {
    return this.httpClient.get(environment.api_url + '/getListaPratiche?department=' + department + '&uuid=' + uuid, this.header).pipe(map((response) => response));
  }

  updDocumentoPratica(department: string, id: string, file: File) {
    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      }
    };
    const formData: FormData = new FormData();
    if (file != null || file !== undefined) {
      formData.append('file', file, file.name);
    }
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post(environment.api_url + '/uploadDocumentoPratica?department=' + department + '&procedureid=' + id , formData, header).pipe(map(response => response));
  }

  getListaEspertiPratica(department: string, id: string): Observable<Expert[]> {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<Expert[]>(environment.api_url + '/getListaEspertiPratica?department=' + department + '&id=' + id, this.header).pipe(map((response) => response));
  }

  addEspertoPratica(department: string, id: string, body: any): Observable<Expert> {
    const header = { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } };
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post(environment.api_url + '/addEspertoPratica?deparment=' + department + '&id=' + id, body, header).pipe(map(response => response));
  }

  delEspertoPratica(deparment: string, id: string, deleteid: string) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.delete(environment.api_url + '/delEspertoPratica?deparment=' + deparment + '&id=' + id + '&deleteid=' + deleteid, this.header).pipe(map(response => response));
  }

  commitPratica(department: string, id: string) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post(environment.api_url + '/commitPratica/department=' + department + '&id='  + id, this.header).pipe(map(response => response));
  }

  verificaToken(): Observable<boolean> {
    return this.httpClient.get<boolean>(environment.api_url + '/validatetoken', this.header).pipe(map(response => response));
  }

}
