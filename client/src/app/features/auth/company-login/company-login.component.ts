import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './company-login.component.html',
  styleUrls: ['./company-login.component.css']
})
export class CompanyLoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  onSubmit() {
    console.log('Company Login attempt', this.loginData);
  }
}
