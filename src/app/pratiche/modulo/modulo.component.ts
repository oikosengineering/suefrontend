import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/core/guards/can-deactivate.guard';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit, CanComponentDeactivate {

  idModulo;
  idPratica;
  saved_form = true;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    $event.returnValue =false;
  }

  constructor(
    private route: ActivatedRoute,
    private dialog: DialogMessageService
  ) {
    this.route.params.subscribe(routeParams => {
      console.log(routeParams);
      this.idModulo = routeParams.idModulo;
      this.idPratica = routeParams.idPratica;
    });
   }

  ngOnInit(): void {

  }

  saveEvent(event){
    this.saved_form = event;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.saved_form) {
      return this.dialog.openDialog("Attenzione", "Stai per uscire dalla pratica senza aver salvato, sei sicuro?");
    }
    return true;
  }

}
