declare var google: any;
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() { }

  User: user | undefined;

  onSubmit(val: NgForm) {

    this.User = val.value;
    console.log('User', this.User);

    if (this.User) {
      this.authService.userLogin(this.User).subscribe({
        next: (res) => {
          console.log('response', res);
          console.log('res.success', res.success)

          if (res?.success) {
            alert(res?.message);
            this.router.navigateByUrl('/home', { replaceUrl: true });
            return;
          }
        },
        error: (err) => {
          alert(err?.error?.message);
          console.log("res.messag", err)
        }
      })
    }


  }

  signInWithGoogle() {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: environment.CLIENT_ID,
      scope: 'email profile openid',
      ux_mode: 'popup',
      callback: (response: any) => {
        console.log("Google Auth Response: ", response);
        if (response.code) {
          this.sendCodeToBackend(response.code);
        }
      },
    });
    
    client.requestCode();
  }

  sendCodeToBackend(code: string) {

    this.authService.googleSignIn(code).subscribe({
      next: (res: any) => {
        console.log('Login Successful');
        if (res?.success) {
          alert(res?.message);
          this.router.navigateByUrl('/home', { replaceUrl: true });
          return;
        }

      },
      error: (err) => {
        alert(err?.error?.message);
        console.log("res.messag", err)
      }
    });
  }
}
