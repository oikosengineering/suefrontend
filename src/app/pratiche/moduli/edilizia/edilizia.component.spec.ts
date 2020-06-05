import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdiliziaComponent } from './edilizia.component';

describe('RichiestaRotturaSuoloComponent', () => {
  let component: EdiliziaComponent;
  let fixture: ComponentFixture<EdiliziaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdiliziaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdiliziaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
