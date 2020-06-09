import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { Province } from 'src/app/core/models/models';

@Component({
  selector: 'app-dettagli-pratica',
  templateUrl: './dettagli-pratica.component.html',
  styleUrls: ['./dettagli-pratica.component.scss']
})
export class DettagliPraticaComponent implements OnInit {

  idProcedure;

  data_procedure;

  isLoading = true;

  tipologie = [];
  generi = [];
  pavimentazioni = [];
  esecutori = [];
  tipologie_contatto = [];
  qualifiche = [];
  tipi_documento = [];
  province: Province[] = [];
  nazioni = [];
  comuni = {};
  titoli_professionali = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: AppApiService
  ) {
    this.chargeData();
  }

  ngOnInit(): void {
  }

  chargeData(){
    let promises = [];
    promises.push(this.getProcedure());
    promises.push(this.getProvince());
    promises.push(this.getTitoliProfessionali());
    promises.push(this.getNazioni());
    promises.push(this.getOwnerType());
    promises.push(this.getGender());
    promises.push(this.getFlooringType());
    promises.push(this.getWorkSupplier());
    promises.push(this.getContactsType());
    promises.push(this.getQualification());
    promises.push(this.getDocumentType());
    Promise.all(promises).then(result => {
      this.isLoading = false;
    }).catch(error => {
      console.log(error);
      this.isLoading = false;
    })
  }

  getProcedure(){
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(routeParams => {
        this.idProcedure = routeParams.idProcedure;
        this.apiService.getDettagliPratica('building', this.idProcedure).subscribe(result => {
          console.log(result);
          this.data_procedure = result['data'];
          resolve(true);
        }, error => {
          reject(error);
        });
      });
    });
  }

  getProvince(){
    return new Promise((resolve, reject) => {
      this.apiService.getProvince().subscribe(data => {
        this.province.push(...data['data']);
        resolve(true);
      });
    })
  }

  getTitoliProfessionali(){
    return new Promise((resolve, reject) => {
      this.apiService.getTitoliProfessionali().subscribe(data => {
        this.titoli_professionali.push(...data['data']);
        resolve(true);
      });
    });
  }

  getNazioni(){
    return new Promise((resolve, reject) => {
      this.apiService.getNazioni().subscribe(data => {
        this.nazioni.push(...data['data'])
        resolve(true);
      });
    });
  }

  getOwnerType(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('owner.type').subscribe(data => {
        this.tipologie.push(...data['data']);
        resolve(true);
      });
    });
  }

  getGender(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('gender').subscribe(data => {
        this.generi.push(...data['data']);
        resolve(true);
      });
    });
  }
  
  getFlooringType(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('building.details.flooring_type').subscribe(data => {
        this.pavimentazioni.push(...data['data']);
        resolve(true);
      });
    });
  }

  getWorkSupplier(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('experts.work_supplier').subscribe(data => {
        this.esecutori.push(...data['data']);
        resolve(true);
      });
    });
  }

  getContactsType(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('contacs.type').subscribe(data => {
        this.tipologie_contatto.push(...data['data']);
        resolve(true);
      });
    });
  }
  
  getQualification(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('experts.qualification').subscribe(data => {
        this.qualifiche.push(...data['data']);
        resolve(true);
      });
    });
  }

  getDocumentType(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('owner.person.document_type').subscribe(data => {
        this.tipi_documento.push(...data['data']);
        resolve(true);
      });
    });
  }
}
