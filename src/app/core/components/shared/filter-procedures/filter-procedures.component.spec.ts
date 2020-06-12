import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProceduresComponent } from './filter-procedures.component';

describe('FilterProceduresComponent', () => {
  let component: FilterProceduresComponent;
  let fixture: ComponentFixture<FilterProceduresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterProceduresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
