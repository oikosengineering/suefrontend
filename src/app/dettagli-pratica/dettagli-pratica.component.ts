import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { Province } from 'src/app/core/models/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { UploadDocumentsComponent } from 'src/app/core/components/shared/documents/upload-documents/upload-documents.component';
import { CanUploadPipe } from 'src/app/core/pipes/can-upload.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateExtensionComponent } from 'src/app/core/components/shared/extensions/create-extension/create-extension.component';
import { ViewExpertsComponent } from '../core/components/shared/view-experts/view-experts.component';
import { ViewDetailsDirective } from '../core/directives/view-details.directive';
import { Location } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-dettagli-pratica',
  templateUrl: './dettagli-pratica.component.html',
  styleUrls: ['./dettagli-pratica.component.scss']
})
export class DettagliPraticaComponent implements OnInit {

  idProcedure;

  id_user;

  data_procedure;

  tabs = ['owner', 'experts', 'administrator', 'supplier', 'details', 'documents', 'extensions']

  activeTab: string = 'owner';

  documents_uploaded = [];

  isOwner = false;
  isLoading = false;
  can_modify = false;
  can_extend = false;
  can_commit = false;

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
  @ViewChild(ViewExpertsComponent) viewExperts: ViewExpertsComponent;
  @ViewChild(ViewDetailsDirective) viewDetails: ViewDetailsDirective;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(
    private route: ActivatedRoute,
    private apiService: AppApiService,
    private auth: AuthService,
    private canUpload: CanUploadPipe,
    private snackBar: MatSnackBar,
    private location: Location,
    private router: Router
  ) {
    this.getProcedure();
    this.route.fragment.subscribe(fragment => {
      if(this.tabGroup){
        this.tabGroup.selectedIndex = this.getIndexTab(fragment) || 0;
      }
    })
  }

  ngOnInit(): void {
    this.id_user = this.auth.getIdUser();
  }

  chargeData() {
    let promises = [];
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
      setTimeout(() => {
        this.activeTab = this.route.snapshot.fragment || 'owner';
        this.tabGroup.selectedIndex = this.getIndexTab(this.activeTab) || 0;
      }, 10);
      
    }).catch(error => {
      this.getTipologieFileObbligatori();
      console.log(error);
      this.isLoading = false;
    })
  }

  getProcedure() {
    this.isLoading = true;
    this.route.params.subscribe(routeParams => {
      this.idProcedure = routeParams.idProcedure;
      this.apiService.getDettagliPratica('building', this.idProcedure).subscribe(result => {
        console.log(result);
        if (result !== null) {
          if(true){
            this.data_procedure = result['data'];
            this.checkCanModify(this.data_procedure.status);
            this.checkOwner();
            this.checkExtend();
            this.checkCanCommit();
            this.checkTabs();
            this.chargeData();
          } else {
            this.snackBar.open("Accesso negato", null, {duration: 2000});
            this.location.back();
          }
        }
      });
    });
  }

  getProvince() {
    return new Promise((resolve, reject) => {
      this.apiService.getProvince().subscribe(data => {
        this.province.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    })
  }

  getTitoliProfessionali() {
    return new Promise((resolve, reject) => {
      this.apiService.getTitoliProfessionali().subscribe(data => {
        this.titoli_professionali.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getNazioni() {
    return new Promise((resolve, reject) => {
      this.apiService.getNazioni().subscribe(data => {
        this.nazioni.push(...data['data'])
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getOwnerType() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('owner.type').subscribe(data => {
        this.tipologie.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getGender() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('gender').subscribe(data => {
        this.generi.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getFlooringType() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('building.details.flooring_type').subscribe(data => {
        this.pavimentazioni.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getWorkSupplier() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('experts.work_supplier').subscribe(data => {
        this.esecutori.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getContactsType() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('contacs.type').subscribe(data => {
        this.tipologie_contatto.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getQualification() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('experts.qualification').subscribe(data => {
        this.qualifiche.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getDocumentType() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('owner.person.document_type').subscribe(data => {
        this.tipi_documento.push(...data['data']);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getDocumentsUploaded() {
    return new Promise((resolve, reject) => {
      this.apiService.getDocumentiPratica('building', this.idProcedure).subscribe(data => {
        this.documents_uploaded = data['data'];
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getTipologieFileObbligatori() {
    return new Promise((resolve, reject) => {
      this.apiService.getListaDocumentiObbligatoriPratica('building', this.data_procedure.category).subscribe(data => {
        this.tipologie_file = data['data'];
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  submitDetail(value: any) {
    console.log("Dettagli pratica", value);
    this.apiService.modificaDettaglioPratica('building', this.data_procedure.id, value).subscribe(result => {
      console.log(result);
      if (result !== null && result !== undefined) {
        if (result['status'] === 200) {
          if (result['data'].details.building_site !== null || result['data'].details.building_site !== undefined) {
            // tslint:disable-next-line: max-line-length
            this.apiService.setGeomToPratica(result['data'].number, result['data'].status.toString(), result['data'].details.building_site.geometry).subscribe(result => {
              if (result['status'] == 200) {
                console.log("Geometrie aggiornate");
              } else {
                console.log("Geometrie non aggiornate");
              }
            }, error => {
              console.log("Geometrie non aggiornate");
            });
          }
          this.data_procedure = result['data'];
          this.viewDetails.completeModify();
        } else {
          this.viewDetails.abortModify();
        }
      }
      this.isLoading = false;
    }, error => {
      console.log(error);
      this.viewDetails.abortModify();
      this.isLoading = false;
    });
  }

  getExperts() {
    this.apiService.getListaEspertiPratica('building', this.data_procedure.id).subscribe(result => {
      this.data_procedure.experts = result['data'].experts;
      this.viewExperts.isLoading = false;
    }, error => {
      this.snackBar.open("Errore di sincronizzazione", null, { duration: 2000 });
      this.viewExperts.isLoading = false;
    })
  }

  deleteExpert(expert_id: string) {
    console.log("Tecnico pratica", expert_id);
    this.apiService.delEspertoPratica('building', this.data_procedure.id, expert_id).subscribe(result => {
      console.log(result);
      this.getExperts();
    }, error => {
      console.log(error);
      this.snackBar.open("Errore, il tecnico non è stato eliminato", null, { duration: 2000 });
      this.viewExperts.isLoading = false;
    });
  }

  addExpert(expert: any) {
    console.log("Esperto da aggiungere", expert);
    this.apiService.addEspertoPratica('building', this.data_procedure.id, expert).subscribe(result => {
      console.log(result);
      this.viewExperts.completeAddExpert();
      this.getExperts();
    }, error => {
      console.log(error);
      this.viewExperts.abortAddExpert();
      this.snackBar.open("Errore, il tecnico non è stato aggiunto", null, { duration: 2000 });
    });
  }

  uploadFile(formData) {
    this.apiService.updDocumentoPratica('building', this.data_procedure.id, formData).subscribe(result => {
      if (this.uploadDocuments) {
        this.uploadDocuments.uploadComplete();
      }
      this.getDocumentsUploaded();
      this.snackBar.open('Documento caricato con successo!', null, {
        duration: 2000
      });
    }, error => {
      if (this.uploadDocuments) {
        this.uploadDocuments.isLoading = false;
        this.snackBar.open('Errore, impossibile caricare il file!', null, {
          duration: 2000
        });
      }
    });
  }

  commitPratica() {
    this.apiService.commitPratica('building', this.data_procedure.id).subscribe(result => {
      if (result['status'] == 200) {
        this.snackBar.open('Pratica somministrata con successo', null, { duration: 2000 });
        this.getProcedure();
      } else {
        this.snackBar.open('Pratica incompleta, verifica i dati', null, { duration: 2000 });
      }
    }, error => {
      this.snackBar.open('Si è verificato un errore!', null, { duration: 2000 });
    })
  }

  checkCanModify(value) {
    this.can_modify = this.canUpload.transform(value);
  }

  checkOwner() {
    this.isOwner = this.data_procedure.user_id === this.id_user;
    this.can_modify = this.can_modify && this.isOwner;
  }

  checkExtend() {
    this.can_extend = this.data_procedure.status == 'APPROVED' && (this.data_procedure.user_id === this.id_user);
  }

  checkCanCommit() {
    this.can_commit = this.data_procedure.status == 'PENDING';
  }

  checkTabs(){
    this.tabs = [];
    if(this.data_procedure.owner){
      this.tabs.push('owner');
    }
    if(this.data_procedure.experts){
      this.tabs.push('experts');
    }
    if(this.data_procedure.administrator){
      this.tabs.push('administrator');
    }
    if(this.data_procedure.supplier){
      this.tabs.push('supplier');
    }
    if(this.data_procedure.details){
      this.tabs.push('details');
    }
    this.tabs.push(...['documents', 'extensions']);
  }

  getIndexTab(value: string): number {
    return this.tabs.indexOf(value);
  }

  getTabName(index: number): string {
    return this.tabs[index] || null;
  }

  changedTab(event){
    this.changeFragment(this.getTabName(event));
  }

  changeFragment(fragment) {
    if(this.tabGroup)
      if(!fragment)
        this.router.navigate( [ 'dettagli-pratica', this.idProcedure])
      else {
        this.router.navigate( [ 'dettagli-pratica', this.idProcedure], { fragment: fragment } )
      }
  }
}
