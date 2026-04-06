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
    // Attempt to silently map completed surveys if user is authenticated natively
    this.userService.getGivenSurveys().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          // If the backend returns wrapped transactions, we map them directly
          this.completedSurveys = res.data;
        }
      },
      error: () => {
        // Silently swallow; user simply isn't logged in or isn't a standard 'USER' profile
      }
    });
  }

  toggleDropdown() {
    this.showSurveyDropdown = !this.showSurveyDropdown;
  }
}
