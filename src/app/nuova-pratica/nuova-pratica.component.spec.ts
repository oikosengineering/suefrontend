import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovaPraticaComponent } from './nuova-pratica.component';

describe('NuovaPraticaComponent', () => {
  let component: NuovaPraticaComponent;
  let fixture: ComponentFixture<NuovaPraticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuovaPraticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuovaPraticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
