import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppApiService } from 'src/app/core/services/app-api.service';

@Component({
  selector: 'app-dettagli-pratica',
  templateUrl: './dettagli-pratica.component.html',
  styleUrls: ['./dettagli-pratica.component.scss']
})
export class DettagliPraticaComponent implements OnInit {

  idProcedure;

  constructor(
    private route: ActivatedRoute,
    private apiService: AppApiService
  ) {
    this.route.params.subscribe(routeParams => {
      this.idProcedure = routeParams.idPratica;
      this.getProcedure(this.idProcedure);
    });
  }

  ngOnInit(): void {
  }

  getProcedure(idProcedure: string){
    this.apiService.getDettaglioPratica(idProcedure).subscribe(result => {
      console.log(result);
    });
  }

}
