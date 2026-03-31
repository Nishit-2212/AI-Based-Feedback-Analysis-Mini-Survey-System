import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-survey-display',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './survey-display.component.html',
  styleUrls: ['./survey-display.component.css']
})
export class SurveyDisplayComponent implements OnInit {
  surveyId: string | null = null;
  transactionId: string | null = null;

  questions: any[] = [];
  currentIndex: number = 0;
  
  currentTextAnswer: string = ''; 
  currentCheckboxAnswers: { [key: string]: boolean } = {};

  surveyName: string = 'Feedback Survey';

  error: string | null = null;
  completed: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('surveyId');
    this.transactionId = this.route.snapshot.paramMap.get('transactionId');

    if (!this.surveyId || !this.transactionId) {
      this.error = "survey Id and trenasaction id is missing.";
      return;
    }

    this.checkCache();
  }

  checkCache() {

    const cachedQuestions = localStorage.getItem(`survey_questions`);
    const metaName = localStorage.getItem(`survey_Name`);
    
    if (metaName) this.surveyName = metaName;

    if (cachedQuestions) {
        this.questions = JSON.parse(cachedQuestions);
    }

    if (!this.questions || this.questions.length === 0) {
      this.error = "There no question in this something went wrong";
      return;
    }
  }

  

  get currentQuestion() {
    if (this.questions.length === 0) return null;
    return this.questions[this.currentIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentIndex === this.questions.length - 1;
  }

  nextQuestion() {

    let answer: string[] = [];

    if (this.currentQuestion.questionType === 'MULTIPLE') {
      // this is for chekcbox
      answer = Object.keys(this.currentCheckboxAnswers).filter(k => this.currentCheckboxAnswers[k]);
    } else {
      // this is for text and mcq
      if (this.currentTextAnswer.trim()) {
        answer = [this.currentTextAnswer.trim()];
      }
    }

    if (answer.length === 0) {
        alert('Please write you answer.');
        return; 
    }

    const payload = {
        questionKey: this.currentQuestion._id, 
        answer: answer
    };

    let survey_answer: any[] = [];
    const localStorageAnswer = localStorage.getItem(`survey_answer`);
    if (localStorageAnswer) {
          survey_answer = JSON.parse(localStorageAnswer); 
    }

    survey_answer.push(payload);    
    localStorage.setItem(`survey_answer`, JSON.stringify(survey_answer));

    // 4. handle Submit logic
    if (this.isLastQuestion) {
       this.submitTransaction(survey_answer);
    } else {
       this.currentIndex++;
       this.currentTextAnswer = '';
       this.currentCheckboxAnswers = {};
    }
  }

  submitTransaction(finalAnswers: any[]) {
      
      console.log('--- SURVEY SUBMISSION PAYLOAD ---');
      console.log('Transaction UUID:', this.transactionId);
      console.log('Final Answers Array:', finalAnswers);
      console.log('---------------------------------');

      localStorage.removeItem(`survey_questions`);
      localStorage.removeItem(`survey_Name`);

      this.completed = true;
  }

  returnHome() {
      this.router.navigate(['/home']);
  }
}
