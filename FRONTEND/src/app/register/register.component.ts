import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  address: string = '';
  phone: string = '';

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(
      this.username,
      this.password,
      this.firstname,
      this.lastname,
      this.email,
      this.address,
      this.phone
    ).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => this.errorMessage = err.error.message || 'Erreur lors de l\'inscription.'
    });
  }
}
