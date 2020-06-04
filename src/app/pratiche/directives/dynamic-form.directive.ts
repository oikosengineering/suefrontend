import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EdiliziaComponent } from '../moduli/edilizia/edilizia.component';

const componentMapper = {
  'rottura_suolo': EdiliziaComponent,
  'occupazione_edile': EdiliziaComponent,
  'occupazione_aree_pubbliche': EdiliziaComponent,
  'ocupazione_suolo_traslochi': EdiliziaComponent
};

@Directive({
  selector: '[dynamicForm]'
})
export class DynamicFormDirective {
  @Input() modulo: string;
  @Output() saved = new EventEmitter<boolean>();
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
    this.componentRef.instance.saved.subscribe(value => {
      this.saved.emit(value);
    })
  }
}
