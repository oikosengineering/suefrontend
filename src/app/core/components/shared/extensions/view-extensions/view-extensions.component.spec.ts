import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExtensionsComponent } from './view-extensions.component';

describe('ViewExtensionsComponent', () => {
  let component: ViewExtensionsComponent;
  let fixture: ComponentFixture<ViewExtensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExtensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExtensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
