import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-given-surveys',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './given-surveys.component.html',
  styleUrls: ['./given-surveys.component.css']
})
export class GivenSurveysComponent implements OnInit {

  completedSurveys: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getGivenSurveys().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.completedSurveys = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = "Could not verify historical surveys. Please log in first.";
        this.loading = false;
      }
    });
  }
}
