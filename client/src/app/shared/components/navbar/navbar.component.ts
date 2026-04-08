import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

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
  authSignal;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.authSignal = this.authService.currentUser;
  }

  ngOnInit(): void {
    // Check if the user is natively logged in. If they are, extract username!
    this.authService.getUserInfo().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const uName = res.data.userName || res.data.companyName || 'User';
          this.authService.updateAuthSignal(true, uName);
        }
      },
      error: () => {
        this.authService.updateAuthSignal(false);
      }
    });

    // Attempt to silently map completed surveys if user is authenticated natively
    this.userService.getGivenSurveys().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.completedSurveys = res.data;
        }
      },
      error: () => {
        // Silently swallow; user simply isn't logged in or isn't a standard 'USER' profile
      }
    });
  }

  logout() {
    this.authService['http'].post(this.authService['apiUrl'] + '/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        this.authService.updateAuthSignal(false);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  toggleDropdown() {
    this.showSurveyDropdown = !this.showSurveyDropdown;
  }
}
