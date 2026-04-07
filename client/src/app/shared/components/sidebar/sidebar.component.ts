import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private sharedService: SharedService, private router: Router) { }

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
          this.router.navigateByUrl('/auth/company-login',{ replaceUrl: true })
          alert("Logout succesful.");
        }
      },
      error: () => {
        console.log('Something goes wrong in navbar component');
      }
    })
  }

}
