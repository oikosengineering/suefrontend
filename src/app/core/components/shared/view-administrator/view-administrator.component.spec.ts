import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdministratorComponent } from './view-administrator.component';

describe('ViewAdministratorComponent', () => {
  let component: ViewAdministratorComponent;
  let fixture: ComponentFixture<ViewAdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAdministratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
