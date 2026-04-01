import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { company } from '../../../models/company.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-company-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './company-sign-up.component.html',
  styleUrls: ['./company-sign-up.component.css']
})
export class CompanySignUpComponent {
  // signUpData = {
  //   name: '',
  //   companyName: '',
  //   companyEmail: '',
  //   country: '',
  //   state: '',
  //   password: ''
  // };

  constructor(private authService: AuthService, private router: Router) { }

  Company: company | undefined;

  onSubmit(val: NgForm) {

    this.Company = val.value;
    console.log('details', this.Company)

    if (this.Company) {
      this.authService.companySignup(this.Company).subscribe({
        next: (res) => {
          console.log('response', res);
          console.log('res.success', res.success)

          if (res?.success) {
            alert(res?.message);
            this.router.navigateByUrl('/auth/company-login', { replaceUrl: true });
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
}
