import { Directive, Output, Input, EventEmitter, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ViewRotturaSuoloComponent } from '../components/shared/details/view-rottura-suolo/view-rottura-suolo.component';
import { ViewOccupazioneSuoloEdilizioComponent } from '../components/shared/details/view-occupazione-suolo-edilizio/view-occupazione-suolo-edilizio.component';
import { ViewOccupazioneSuoloPubblicoComponent } from '../components/shared/details/view-occupazione-suolo-pubblico/view-occupazione-suolo-pubblico.component';
import { ViewTraslochiLavoriComponent } from '../components/shared/details/view-traslochi-lavori/view-traslochi-lavori.component';

const componentMapper = {
  'rottura_suolo': ViewRotturaSuoloComponent,
  'occupazione_suolo_edilizio': ViewOccupazioneSuoloEdilizioComponent,
  'occupazione_suolo_pubblico': ViewOccupazioneSuoloPubblicoComponent,
  'traslochi_lavori': ViewTraslochiLavoriComponent
};

@Directive({
  selector: '[viewDetails]'
})
export class ViewDetailsDirective {

  @Input() type: string;
  @Input() data: any;
  @Input() pavimentazioni: any;
  @Input() modifiable: boolean
  @Output() update_details = new EventEmitter();

  componentRef: any;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit(){
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.data = this.data;
    this.componentRef.instance.modifiable = this.modifiable;
    if(this.pavimentazioni){
      this.componentRef.instance.pavimentazioni = this.pavimentazioni;
    }
    this.componentRef.instance.update_details.subscribe(value => {
      this.update_details.emit(value);
    })
  }

  completeModify(){
    this.componentRef.instance.completeModify();
  }

  abortModify(){
    this.componentRef.instance.abortModify();
  }
}
