

import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [MatCardModule,MatIconModule,RouterModule,RouterOutlet],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})

export class ErrorPageComponent implements OnInit {
  errorMessage: string = "Something went wrong. Please try again later."; // Default error message

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Here you could inject an error service or handle dynamic error messages
    // Example: Set dynamic error message from route or service
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['errorMessage']) {
      this.errorMessage = navigation.extras.state['errorMessage'];
    }

  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to home or previous page
  }
}



