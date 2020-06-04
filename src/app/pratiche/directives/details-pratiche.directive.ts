import { Directive, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { RotturaSuoloComponent } from '../moduli/components-edilizia/rottura-suolo/rottura-suolo.component';
import { FormGroup } from '@angular/forms';
import { OccupazioneEdileComponent } from '../moduli/components-edilizia/occupazione-edile/occupazione-edile.component';

const componentMapper = {
  'rottura_suolo': RotturaSuoloComponent,
  'occupazione_edile': OccupazioneEdileComponent,
  'occupazione_aree_pubbliche': '',
  'ocupazione_suolo_traslochi': ''
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
