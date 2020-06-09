import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRotturaSuoloComponent } from './view-rottura-suolo.component';

describe('ViewRotturaSuoloComponent', () => {
  let component: ViewRotturaSuoloComponent;
  let fixture: ComponentFixture<ViewRotturaSuoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRotturaSuoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRotturaSuoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
