import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/core/guards/can-deactivate.guard';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit, CanComponentDeactivate {

  idModulo;
  idPratica;
  saved_form = true;
  @HostListener('window:beforeunload') canDeactivate(): Observable<boolean> | boolean {
    if (!this.saved_form) {
      return window.confirm('Are you sure?');
    }
    return true;
  }

  constructor(
    private route: ActivatedRoute,
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
    console.log(event);
    this.saved_form = event;
  }

}
