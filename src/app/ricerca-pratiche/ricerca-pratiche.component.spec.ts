import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaPraticheComponent } from './ricerca-pratiche.component';

describe('RicercaPraticheComponent', () => {
  let component: RicercaPraticheComponent;
  let fixture: ComponentFixture<RicercaPraticheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaPraticheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaPraticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
