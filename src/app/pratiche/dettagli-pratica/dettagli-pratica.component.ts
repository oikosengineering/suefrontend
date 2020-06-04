import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dettagli-pratica',
  templateUrl: './dettagli-pratica.component.html',
  styleUrls: ['./dettagli-pratica.component.scss']
})
export class DettagliPraticaComponent implements OnInit {

  idProcedure;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(routeParams => {
      console.log(routeParams);
      this.idProcedure = routeParams.idPratica;
    });
  }

  ngOnInit(): void {
  }

}
