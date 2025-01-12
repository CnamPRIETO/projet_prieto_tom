import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RegisterResponse } from '../models/auth-response.interface';

@Component({
  selector: 'app-profil-component',
  imports: [],
  templateUrl: './profil-component.component.html',
  styleUrl: './profil-component.component.css'
})
export class ProfilComponentComponent {
  constructor(private authService: AuthService, private router: Router) {}

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
