import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTraslochiLavoriComponent } from './view-traslochi-lavori.component';

describe('ViewTraslochiLavoriComponent', () => {
  let component: ViewTraslochiLavoriComponent;
  let fixture: ComponentFixture<ViewTraslochiLavoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTraslochiLavoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTraslochiLavoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
