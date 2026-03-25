import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpData = {
    name: '',
    email: '',
    password: ''
  };

  onSubmit() {
    console.log('Sign-Up attempt', this.signUpData);
  }
}
