import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupazioneEdileComponent } from './occupazione-edile.component';

describe('OccupazioneEdileComponent', () => {
  let component: OccupazioneEdileComponent;
  let fixture: ComponentFixture<OccupazioneEdileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupazioneEdileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupazioneEdileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
