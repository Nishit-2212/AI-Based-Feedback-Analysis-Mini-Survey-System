import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisSurveyComponent } from './analysis-survey.component';

describe('AnalysisSurveyComponent', () => {
  let component: AnalysisSurveyComponent;
  let fixture: ComponentFixture<AnalysisSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
