import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { createTransformFromCoordinateTransform } from 'ol/proj';
import { Country, Province, City, Document, Procedure, ListaPratiche, Expert } from '../models/models';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppApiService {
  header = { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } };
  constructor(
    private httpClient: HttpClient,
  ) { }

  /*
  GET dati base
  */

  getNazioni() {
    return this.httpClient.get(environment.api_url + '/countries', this.header).pipe(map((response)  => response));
  }

  getProvince(): Observable<Province> {
    return this.httpClient.get(environment.api_url + '/province', this.header).pipe(map(response => response));
  }

  getComuni(code: string): Observable<City> {
    return this.httpClient.get(environment.api_url + '/province/' + code + '/cities', this.header).pipe(map(response => response));
  }

  getTitoliProfessionali() {
    return this.httpClient.get(environment.api_url + '/professional_titles', this.header).pipe(map(response => response));
  }

  /*
  GET PRATICA
  */

  creaRotturaSuolo(json: string): Observable<Procedure> {
    const header = { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } };
    return this.httpClient.post(environment.api_url + '/building/procedures', json, header).pipe(map(response => response));
  }

  getDettaglioPratica(id: string): Observable<Procedure> {
    return this.httpClient.get(environment.api_url + '/building/procedures/' + id, this.header).pipe(map(response => response));
  }

  updDettaglioPratica(id: string, json: string): Observable<Procedure> {
    const body = JSON.stringify(json);
    return this.httpClient.patch(environment.api_url + '/builing/procedures/' + id, body, this.header).pipe(map(response => response));
  }

  getDocumentiPratica(idpratica: string): Observable<Document[]> {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<Document[]>(environment.api_url + '/procedures/' + idpratica + '/documents', this.header).pipe(map(response => response));
  }

  getListaPratiche(): Observable<ListaPratiche> {
    return this.httpClient.get(environment.api_url + '/procedures', this.header).pipe(map(response => response));
  }

  updDocumentoPratica(idpratica: string, file: File) {
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
    return this.httpClient.post(environment.api_url + '/procedures/' + idpratica + '/documents', formData, header).pipe(map(response => response))
  }

  addEspertoPratica(id: string, json: string): Observable<Expert> {
    const body = JSON.stringify(json);
    const header = { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } };
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post(environment.api_url + '/building/procedures/' + id + '/experts', body, header).pipe(map(response => response));
  }

  delEspertoPratica(id: string, expertid: string) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.delete(environment.api_url + '/building/procedures/' + id + '/experts/' + expertid, this.header).pipe(map(response => response));
  }

  endEditPratica(id: string) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post(environment.api_url + '/building/procedures/' + id + '/commit', this.header).pipe(map(response => response));
  }


}
