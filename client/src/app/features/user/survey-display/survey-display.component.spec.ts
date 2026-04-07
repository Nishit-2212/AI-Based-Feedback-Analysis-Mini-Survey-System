import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDisplayComponent } from './survey-display.component';

describe('SurveyDisplayComponent', () => {
  let component: SurveyDisplayComponent;
  let fixture: ComponentFixture<SurveyDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
