import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { PanierState } from '../shared/states/panier-state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    private store = inject(Store);
    private authService = inject(AuthService);
    private router = inject(Router);
    nbProduitsPanier$!: Observable<number>;
    isLoggedIn$!: Observable<boolean>;
    firstname: string = '';

    constructor() {
        this.nbProduitsPanier$ = this.store.select(PanierState.getNbProduits);
        this.isLoggedIn$ = this.authService.isLoggedIn;
    }

    ngOnInit() {
        this.isLoggedIn$.subscribe(isLoggedIn => {
            if (isLoggedIn) {
                const token = this.authService.getToken();
                if (token) {
                    const helper = new JwtHelperService();
                    const decodedToken = helper.decodeToken(token);
                    this.firstname = decodedToken.firstname;
                }
            } else {
                this.firstname = '';
            }
        });
    }
}
