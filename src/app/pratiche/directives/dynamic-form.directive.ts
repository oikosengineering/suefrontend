import { Directive, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { RichiestaRotturaSuoloComponent } from '../moduli/richiesta-rottura-suolo/richiesta-rottura-suolo.component';
import { FormGroup } from '@angular/forms';

const componentMapper = {
  0: RichiestaRotturaSuoloComponent,
};

@Directive({
  selector: '[dynamicForm]'
})
export class DynamicFormDirective {
  @Input() modulo: string;
  @Input() idPratica: string;
  componentRef: any;
  
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.modulo]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.modulo = this.modulo;
    this.componentRef.instance.idPratica = this.idPratica;
  }
}
