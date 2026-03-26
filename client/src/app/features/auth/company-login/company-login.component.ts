import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private authService:AuthService) {}

  Company: company | undefined;

  onSubmit(val: NgForm) {
    
    this.Company = val.value;
    console.log('company',this.Company);

    if(this.Company) {
      this.authService.companyLogin(this.Company).subscribe((res) => {
        console.log('response',res);
        
      })
    }
    

  }
  
}
