import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExtensionComponent } from './view-extension.component';

describe('ViewExtensionComponent', () => {
  let component: ViewExtensionComponent;
  let fixture: ComponentFixture<ViewExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
