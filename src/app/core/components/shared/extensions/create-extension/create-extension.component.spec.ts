import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExtensionComponent } from './create-extension.component';

describe('CreateExtensionComponent', () => {
  let component: CreateExtensionComponent;
  let fixture: ComponentFixture<CreateExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
