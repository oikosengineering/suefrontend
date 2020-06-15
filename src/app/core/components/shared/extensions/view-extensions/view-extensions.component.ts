import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { MatSelectionListChange } from '@angular/material/list';
import { trigger, transition, style, animate } from '@angular/animations';
import { CreateExtensionComponent } from '../create-extension/create-extension.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'view-extensions',
  templateUrl: './view-extensions.component.html',
  styleUrls: ['./view-extensions.component.scss']
})
export class ViewExtensionsComponent implements OnInit {

  extensions = [
    {
      id: 1,
      status: 'NEW',
      expires_on: "2020/06/03",
      created_at: "2020/06/01",
      updated_at: "2020/06/08"
    },
    {
      id: 2,
      status: 'PENDING',
      expires_on: "2020/06/03",
      created_at: "2020/06/01",
      updated_at: "2020/06/25"
    }
  ];
  @Input() can_extend: boolean;
  @Input() procedure: any;


  @ViewChild(CreateExtensionComponent) createExtension: CreateExtensionComponent;

  selected_extension;

  viewSelected = false;
  
  isLoading = false;

  constructor(
    private apiService: AppApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadExtensions();
  }

  loadExtensions(){
    this.isLoading = true;
    this.getExtensions().then(result => {
      this.isLoading = false;
    }).catch(error => {
      console.log(error);
      this.isLoading = false;
    })
  }

  changeExtension(event: MatSelectionListChange){
    this.selected_extension = event.option.value;
    this.viewSelected = !this.viewSelected
  }

  closeViewSelected(){
    this.viewSelected = !this.viewSelected;
  }

  addExtension(value: any){
    this.apiService.creaProroga('building', this.procedure.id, value).subscribe(result => {
      console.log(result);
      if(this.createExtension){
        this.createExtension.uploadComplete();
        this.loadExtensions();
      }
    }, error => {
      if(this.createExtension){
        this.createExtension.isLoading = false;
        this.snackBar.open('Si è verrificato un errore!', null, {
          duration: 2000
        });
      }
    });
  }


  getExtensions(){
    return new Promise((resolve, reject) => {
      this.apiService.getListaProroghePratica('building', this.procedure.id).subscribe(data => {
        console.log(data['data']);
        this.extensions = data['data'];
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

}
