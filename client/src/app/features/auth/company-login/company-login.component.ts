import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { company } from '../../../models/company.model';

@Component({
  selector: 'app-company-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './company-login.component.html',
  styleUrls: ['./company-login.component.css']
})
export class CompanyLoginComponent {

  constructor(private authService: AuthService, private router: Router) { }

  Company: company | undefined;

  onSubmit(val: NgForm) {

    this.Company = val.value;
    console.log('company', this.Company);

    if (this.Company) {
      this.authService.companyLogin(this.Company).subscribe({
        next: (res) => {
          if (res?.success) {
            alert(res?.message);
            this.router.navigateByUrl('/dashboard', { replaceUrl: true });
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
