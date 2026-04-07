import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  completedSurveys: any[] = [];
  showSurveyDropdown: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getGivenSurveys().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.completedSurveys = res.data;
        }
      },
      error: () => {
        console.log('Something goes wrong in navbar component');
      }
    });
  }

  toggleDropdown() {
    this.showSurveyDropdown = !this.showSurveyDropdown;
  }
}
