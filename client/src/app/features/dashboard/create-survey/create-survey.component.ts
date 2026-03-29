import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { SurveyService } from '../../../services/survey.service';

@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent {
  surveyForm: FormGroup;

  constructor(private fb: FormBuilder, private surveyService:SurveyService) {
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      textAnalyzer: [false],
      questions: this.fb.array([])
    });
    
    // By default one question added
    this.addQuestion('MCQ');
  }

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  getOptions(questionIndex: number) {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addQuestion(type: string) {
    const questionGroup = this.fb.group({
      type: [type],
      text: ['', Validators.required],
      options: this.fb.array(type !== 'TEXT' ? [this.createOption(), this.createOption()] : [])
    });
    this.questions.push(questionGroup);
  }

  createOption() {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  addOption(questionIndex: number) {
    this.getOptions(questionIndex).push(this.createOption());
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      console.log('Survey Final JSON Payload:', this.surveyForm.value);
      this.surveyService.createSurvey(this.surveyForm.value).subscribe((res) => {
        console.log('response',res);
        
      });
      alert('Survey Created Successfully!');
    } else {
      this.surveyForm.markAllAsTouched();
      alert('Please fill out all required fields before submitting.');
    }
  }
}
