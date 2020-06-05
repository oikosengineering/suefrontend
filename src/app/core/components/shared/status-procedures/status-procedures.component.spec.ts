import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusProceduresComponent } from './status-procedures.component';

describe('StatusProceduresComponent', () => {
  let component: StatusProceduresComponent;
  let fixture: ComponentFixture<StatusProceduresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusProceduresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
