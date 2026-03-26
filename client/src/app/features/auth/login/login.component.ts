declare var google: any;
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment.development';
import { user } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  User: user | undefined;

  onSubmit(val:NgForm) {
    
    this.User = val.value;
    console.log('User',this.User);

    if(this.User) {
      this.authService.userLogin(this.User).subscribe((res) => {
        console.log('response',res);
      })
    }
    

  }

  signInWithGoogle() {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: environment.CLIENT_ID,
      scope: 'email profile openid',
      ux_mode: 'popup',
      callback: (response: any) => {
        // Here you will see: authuser, code, prompt, etc!
        console.log("Google Auth Response: ", response);
        if (response.code) {
          // Send the authorization code to your Node.js Backend
          this.sendCodeToBackend(response.code);
        }
      },
    });
    // Triggers the popup
    client.requestCode();
  }

  sendCodeToBackend(code: string) {
    // Call your Node API endpoint
    this.authService.googleSignIn(code).subscribe({
      next: (res: any) => {
        console.log('Login Successful, JWT Token received:', res.token);
        // Save token to localStorage and navigate to dashboard
      },
      error: (err) => console.error('Login Failed', err)
    });
  }
}
