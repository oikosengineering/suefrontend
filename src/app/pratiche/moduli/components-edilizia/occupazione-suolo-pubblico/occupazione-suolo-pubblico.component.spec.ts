import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupazioneSuoloPubblicoComponent } from './occupazione-suolo-pubblico.component';

describe('OccupazioneSuoloPubblicoComponent', () => {
  let component: OccupazioneSuoloPubblicoComponent;
  let fixture: ComponentFixture<OccupazioneSuoloPubblicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupazioneSuoloPubblicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupazioneSuoloPubblicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
