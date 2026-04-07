import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  pastQuestions: any[] = [];
  commonQuestions: any[] = [];
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modalMode: 'PAST' | 'COMMON' = 'PAST';

  constructor(private fb: FormBuilder, private companyService:CompanyService) {
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      textAnalyzer: [false],
      questions: this.fb.array([])
    });
    
    // By default one question added
    // this.addQuestion('MCQ');
  }

  ngOnInit(): void {
    this.fetchPastQuestions();
    this.fetchCommonQuestions();
  }

  fetchPastQuestions() {
    this.companyService.getCompanyQuestions().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.pastQuestions = res.data;
        }
      },
      error: (err: any) => {
        console.error("Error fetching past questions:", err)
      }
    });
  }

  fetchCommonQuestions() {
    this.companyService.getAllCommanQuestions().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.commonQuestions = res.data;
        }
      },
      error: (err: any) => console.error("Error fetching common questions:", err)
    });
  }

  get filteredQuestions() {
    const activeList = this.modalMode === 'PAST' ? this.pastQuestions : this.commonQuestions;
    if (!this.searchQuery) return activeList;
    const lowerQuery = this.searchQuery.toLowerCase();
    return activeList.filter(q => q.questionText?.toLowerCase().includes(lowerQuery));
  }

  openModal(mode: 'PAST' | 'COMMON' = 'PAST') {
    this.modalMode = mode;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.searchQuery = '';
  }

  addFromBank(question: any) {
    const questionGroup = this.fb.group({
      type: [question.questionType],
      text: [question.questionText, Validators.required],
      options: this.fb.array([])
    });

    const optionsArray = questionGroup.get('options') as FormArray;
    if (question.options && question.options.length > 0) {
      for (const opt of question.options) {
        optionsArray.push(this.fb.group({ value: [opt, Validators.required] }));
      }
    } else if (question.questionType !== 'TEXT') {
        optionsArray.push(this.fb.group({ value: ['', Validators.required] }));
        optionsArray.push(this.fb.group({ value: ['', Validators.required] }));
    }

    this.questions.push(questionGroup);
    this.closeModal();
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
      this.companyService.createSurvey(this.surveyForm.value).subscribe((res) => {
        // :TODO handle response
        console.log('response',res);
      });
      alert('Survey Created Successfully!');
    } else {
      this.surveyForm.markAllAsTouched();
      alert('Please fill out all required fields before submitting.');
    }
  }
}
