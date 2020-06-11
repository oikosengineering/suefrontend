import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { Province } from 'src/app/core/models/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { UploadDocumentsComponent } from 'src/app/core/components/shared/documents/upload-documents/upload-documents.component';
import { CanUploadPipe } from 'src/app/core/pipes/can-upload.pipe';

@Component({
  selector: 'app-dettagli-pratica',
  templateUrl: './dettagli-pratica.component.html',
  styleUrls: ['./dettagli-pratica.component.scss']
})
export class DettagliPraticaComponent implements OnInit {

  idProcedure;

  id_user;

  data_procedure;

  documents_uploaded = [];

  isLoading = true;
  can_upload = false;

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
  tipologie_file = [];

  @ViewChild(UploadDocumentsComponent) uploadDocuments: UploadDocumentsComponent;

  constructor(
    private route: ActivatedRoute,
    private apiService: AppApiService,
    private auth: AuthService,
    private canUpload: CanUploadPipe
  ) {
    this.chargeData();
  }

  ngOnInit(): void {
    this.id_user = this.auth.getIdUser();
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
    promises.push(this.getDocumentsUploaded());
    Promise.all(promises).then(result => {
      this.getTipologieFileObbligatori();
      this.isLoading = false;
    }).catch(error => {
      this.getTipologieFileObbligatori();
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
          this.checkCanUpload(this.data_procedure.status);
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
      }, error => {
        resolve(true);
      });
    })
  }

  getTitoliProfessionali(){
    return new Promise((resolve, reject) => {
      this.apiService.getTitoliProfessionali().subscribe(data => {
        this.titoli_professionali.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getNazioni(){
    return new Promise((resolve, reject) => {
      this.apiService.getNazioni().subscribe(data => {
        this.nazioni.push(...data['data'])
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getOwnerType(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('owner.type').subscribe(data => {
        this.tipologie.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getGender(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('gender').subscribe(data => {
        this.generi.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }
  
  getFlooringType(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('building.details.flooring_type').subscribe(data => {
        this.pavimentazioni.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getWorkSupplier(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('experts.work_supplier').subscribe(data => {
        this.esecutori.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getContactsType(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('contacs.type').subscribe(data => {
        this.tipologie_contatto.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }
  
  getQualification(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('experts.qualification').subscribe(data => {
        this.qualifiche.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getDocumentType(){
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('owner.person.document_type').subscribe(data => {
        this.tipi_documento.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getDocumentsUploaded(){
    return new Promise((resolve, reject) => {
      this.apiService.getDocumentiPratica('building', this.idProcedure).subscribe(data => {
        this.documents_uploaded = data['data'];
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getTipologieFileObbligatori(){
    return new Promise((resolve, reject) => {
      this.apiService.getListaDocumentiObbligatoriPratica('building', this.data_procedure.category).subscribe(data => {
        this.tipologie_file = data['data'];
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  submitDetail(value: any){
    console.log("Dettagli pratica", value);
    this.apiService.modificaDettaglioPratica('building', this.data_procedure.id, value).subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    });
  }

  deleteExpert(expert_id: string){
    console.log("Tecnico pratica", expert_id);
    this.apiService.delEspertoPratica('building', this.data_procedure.id, expert_id).subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    });
  }

  addExpert(expert: any){
    console.log("Esperto da aggiungere", expert);
    this.apiService.addEspertoPratica('building', this.data_procedure.id, expert).subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    });
  }

  uploadFile(file: any){
    this.apiService.updDocumentoPratica('building', this.data_procedure.id, file).subscribe(result => {
      console.log(result);
      if(this.uploadDocuments){
        this.uploadDocuments.uploadComplete();
      }
    }, error => {
      if(this.uploadDocuments){
        this.uploadDocuments.isLoading = false;
      }
    });
  }

  checkCanUpload(value){
    this.can_upload = this.canUpload.transform(value);
  }
}
