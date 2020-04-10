import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiePraticheComponent } from './mie-pratiche.component';

describe('MiePraticheComponent', () => {
  let component: MiePraticheComponent;
  let fixture: ComponentFixture<MiePraticheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiePraticheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiePraticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
