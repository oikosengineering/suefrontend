import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettagliPraticaComponent } from './dettagli-pratica.component';

describe('DettagliPraticaComponent', () => {
  let component: DettagliPraticaComponent;
  let fixture: ComponentFixture<DettagliPraticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettagliPraticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettagliPraticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
