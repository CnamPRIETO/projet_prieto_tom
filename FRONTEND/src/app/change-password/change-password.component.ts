import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UpdateUserResponse } from '../models/auth-response.interface';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onChangePassword() {
    // Vérification simple côté front
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';

    
    const userData = {
      oldPassword: this.oldPassword, 
      password: this.newPassword
    };

    // Appel au backend via AuthService
    this.authService.updateUser(userData).subscribe({
      next: (response) => {
        this.successMessage = 'Mot de passe mis à jour avec succès.';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour du mot de passe.';
        this.successMessage = '';
      }
    });
  }
}
