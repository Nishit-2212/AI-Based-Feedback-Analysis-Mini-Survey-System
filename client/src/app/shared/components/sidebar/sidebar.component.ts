import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  authSignal;

  constructor(private sharedService: SharedService, private router: Router, private authService: AuthService) {
    this.authSignal = this.authService.currentUser;
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const uName = res.data.userName || res.data.companyName || 'Company';
          this.authService.updateAuthSignal(true, uName);
        }
      },
      error: () => {
        this.authService.updateAuthSignal(false);
      }
    });
  }

  isCollapsed = false;
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebarEvent.emit(this.isCollapsed);
  }


  logout() {
    this.sharedService.logOut().subscribe({
      next: (res: any) => {
        if (res.success) {

          console.log('Logout button clicked');
          this.authService.updateAuthSignal(false);
          this.router.navigateByUrl('/auth/login',{ replaceUrl: true })
          alert("Logout succesful.");
        }
      },
      error: () => {
        console.log('Something goes wrong in navbar component');
      }
    })
  }

}
