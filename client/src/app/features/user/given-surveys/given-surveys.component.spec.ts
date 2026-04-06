import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivenSurveysComponent } from './given-surveys.component';

describe('GivenSurveysComponent', () => {
  let component: GivenSurveysComponent;
  let fixture: ComponentFixture<GivenSurveysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GivenSurveysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GivenSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
