import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupazioneTraslochiLavoriComponent } from './occupazione-traslochi-lavori.component';

describe('OccupazioneTraslochiLavoriComponent', () => {
  let component: OccupazioneTraslochiLavoriComponent;
  let fixture: ComponentFixture<OccupazioneTraslochiLavoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupazioneTraslochiLavoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupazioneTraslochiLavoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
