import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RegisterResponse } from '../models/auth-response.interface';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-profil-component',
  imports: [FormsModule],
  templateUrl: './profil-component.component.html',
  styleUrl: './profil-component.component.css'
})
export class ProfilComponentComponent {
  constructor(private authService: AuthService, private router: Router) {}
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  address: string = '';
  phone: string = '';
  username: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    // Dès le chargement, on récupère les infos du user
    this.authService.getUserProfile().subscribe({
      next: (user: User) => {
        // On pré-remplit les variables
        this.firstname = user.firstname || '';
        this.lastname = user.lastname || '';
        this.email = user.email || '';
        this.address = user.address || '';
        this.phone = user.phone || '';
        this.username = user.username || '';
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil :', err);
      }
    });
  }

  onUpdateProfile() {
    if (this.newPassword && (this.newPassword !== this.confirmPassword)) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      this.successMessage = '';
      return;
    }

    const userData: any = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      address: this.address,
      phone: this.phone,
      username: this.username,
    };

    if (this.oldPassword) {
      userData.oldPassword = this.oldPassword;
    }
    if (this.newPassword) {
      userData.password = this.newPassword;
    }

    this.authService.updateUser(userData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour.';
        this.successMessage = '';
      }
    });
  }



  onDeleteAccount() {
    // Petite confirmation
    if (confirm('Voulez-vous vraiment supprimer votre compte ?')) {
      this.authService.deleteAccount().subscribe({
        next: (res: RegisterResponse) => {
          console.log('Suppression réussie :', res);
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du compte :', err);
        }
      });
    }
  }
}
