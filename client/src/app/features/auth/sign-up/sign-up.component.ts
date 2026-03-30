import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { user } from '../../../models/user.model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  
  constructor(private authService:AuthService, private router: Router) {}

  User: user | undefined;

  onSubmit(val:NgForm) {
    
    this.User = val.value;
    console.log('User ',this.User);
    
    if(this.User) {
      this.authService.userSignup(this.User).subscribe((res) => {
        console.log('response',res);
      })
    }
  }
}
