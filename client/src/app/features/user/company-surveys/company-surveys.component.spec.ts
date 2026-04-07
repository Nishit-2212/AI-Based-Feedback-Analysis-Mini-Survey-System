import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySurveysComponent } from './company-surveys.component';

describe('CompanySurveysComponent', () => {
  let component: CompanySurveysComponent;
  let fixture: ComponentFixture<CompanySurveysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySurveysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
