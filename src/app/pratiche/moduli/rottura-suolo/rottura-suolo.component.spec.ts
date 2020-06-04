import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotturaSuoloComponent } from './rottura-suolo.component';

describe('RotturaSuoloComponent', () => {
  let component: RotturaSuoloComponent;
  let fixture: ComponentFixture<RotturaSuoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotturaSuoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotturaSuoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
