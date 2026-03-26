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

  constructor(private authService:AuthService, private router: Router) {}

  Company: company | undefined;

  onSubmit(val: NgForm) {

    this.Company = val.value;
    console.log('details',this.Company)

    if(this.Company) {
      this.authService.companySignup(this.Company).subscribe((res) => {
        console.log('response',res)
      })
    }

  }
}
