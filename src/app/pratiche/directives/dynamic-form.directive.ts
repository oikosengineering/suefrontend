import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, Output, EventEmitter, HostListener } from '@angular/core';
import { RichiestaRotturaSuoloComponent } from '../moduli/richiesta-rottura-suolo/richiesta-rottura-suolo.component';
import { FormGroup } from '@angular/forms';

const componentMapper = {
  'rottura_suolo': RichiestaRotturaSuoloComponent,
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
