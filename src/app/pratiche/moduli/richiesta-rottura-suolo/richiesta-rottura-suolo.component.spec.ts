import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiestaRotturaSuoloComponent } from './richiesta-rottura-suolo.component';

describe('RichiestaRotturaSuoloComponent', () => {
  let component: RichiestaRotturaSuoloComponent;
  let fixture: ComponentFixture<RichiestaRotturaSuoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichiestaRotturaSuoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestaRotturaSuoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
