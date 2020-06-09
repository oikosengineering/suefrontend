import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOccupazioneSuoloEdilizioComponent } from './view-occupazione-suolo-edilizio.component';

describe('ViewOccupazioneSuoloEdilizioComponent', () => {
  let component: ViewOccupazioneSuoloEdilizioComponent;
  let fixture: ComponentFixture<ViewOccupazioneSuoloEdilizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOccupazioneSuoloEdilizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOccupazioneSuoloEdilizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
