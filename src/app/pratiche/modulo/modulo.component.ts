import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit {

  idModulo;
  idPratica;
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

}
