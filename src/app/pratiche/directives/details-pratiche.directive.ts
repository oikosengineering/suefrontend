import { Directive, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { RotturaSuoloComponent } from '../moduli/components-edilizia/rottura-suolo/rottura-suolo.component';
import { FormGroup } from '@angular/forms';
import { OccupazioneEdileComponent } from '../moduli/components-edilizia/occupazione-edile/occupazione-edile.component';
import { OccupazioneSuoloPubblicoComponent } from '../moduli/components-edilizia/occupazione-suolo-pubblico/occupazione-suolo-pubblico.component';
import { OccupazioneTraslochiLavoriComponent } from '../moduli/components-edilizia/occupazione-traslochi-lavori/occupazione-traslochi-lavori.component';

const componentMapper = {
  'rottura_suolo': RotturaSuoloComponent,
  'occupazione_suolo_edilizio': OccupazioneEdileComponent,
  'occupazione_suolo_pubblico': OccupazioneSuoloPubblicoComponent,
  'traslochi_lavori': OccupazioneTraslochiLavoriComponent
};

@Directive({
  selector: '[detailsPratiche]'
})
export class DetailsPraticheDirective {

  @Input() modulo: string;
  @Input() form: FormGroup
  componentRef: any;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit(){
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.modulo]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.form = this.form;
  }

}
