import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './company-sign-up.component.html',
  styleUrls: ['./company-sign-up.component.css']
})
export class CompanySignUpComponent {
  signUpData = {
    yourName: '',
    companyName: '',
    companyEmail: '',
    country: '',
    state: '',
    password: ''
  };

  onSubmit() {
    console.log('Company Sign-Up attempt', this.signUpData);
  }
}
