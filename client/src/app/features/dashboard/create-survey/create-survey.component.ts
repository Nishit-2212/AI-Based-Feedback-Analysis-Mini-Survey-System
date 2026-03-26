import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent {
  surveyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      questions: this.fb.array([])
    });
    
    // Auto-add an initial empty question so the canvas isn't totally blank
    this.addQuestion('MCQ (Single Choice)');
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
      options: this.fb.array(type !== 'Open Ended' ? [this.createOption(), this.createOption()] : [])
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
      alert('Survey Draft Created Successfully! The payload is printed cleanly in the browser console.');
    } else {
      this.surveyForm.markAllAsTouched();
      alert('Please fill out all required fields before submitting.');
    }
  }
}
