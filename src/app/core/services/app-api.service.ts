import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AppApiService {
  header = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}};
  constructor(
    private httpClient: HttpClient,
  ) { }


  creaPratica(pratica: string) {
    return this.httpClient.post(environment.api_url + '/frontoffice/pratiche', this.header).pipe(map(response => response['id']));
   }

  getDettaglioPratica(id: string) {
    return this.httpClient.get(environment.api_url + '/frontoffice/pratiche/' + id , this.header).pipe(map(response => response));
  }
  modificaPratica(id: string, pratica: string) {
    return this.httpClient.patch(environment.api_url + '/frontoffice/pratiche/' + id, this.header).pipe(map(response => response['data']));
  }

  getNazioni () {
    return this.httpClient.get(environment.api_url + "/nazioni", this.header).pipe(map(response => response['data']));
  }

  getRegioni () {
    return this.httpClient.get(environment.api_url + "/regioni", this.header).pipe(map(response => response['data']));
  }

  getProvince (cod_reg: string) {
    return this.httpClient.get(environment.api_url + "/province?cod_reg=" + cod_reg, this.header).pipe(map(response => response['data']));
  }

  getComuni (cod_prov: string) {
    return this.httpClient.get(environment.api_url + "/comuni?cod_prov=" + cod_prov, this.header).pipe(map(response => response['data']));
  }

  getAnagrafica () {
    return this.httpClient.get(environment.api_url + "/anagrafica", this.header).pipe(map(response => response['data']));
  }
  
  getTipoUtenti () {
    return this.httpClient.get(environment.api_url + "/listatipoutenti", this.header).pipe(map(response => response['data']));
  }

  setFirstLogin( uuid: string) {
    return this.httpClient.get(`${
      environment.api_url
      }` + '/updfirstlogin?uuid=' + uuid).pipe(map(response => response));
  }
}
