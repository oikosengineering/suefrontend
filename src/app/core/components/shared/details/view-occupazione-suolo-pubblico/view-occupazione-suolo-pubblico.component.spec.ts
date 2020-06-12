import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOccupazioneSuoloPubblicoComponent } from './view-occupazione-suolo-pubblico.component';

describe('ViewOccupazioneSuoloPubblicoComponent', () => {
  let component: ViewOccupazioneSuoloPubblicoComponent;
  let fixture: ComponentFixture<ViewOccupazioneSuoloPubblicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOccupazioneSuoloPubblicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOccupazioneSuoloPubblicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
