import { Routes } from '@angular/router';
import { PanierComponent } from './panier/panier.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfilComponentComponent } from './profil-component/profil-component.component';


export const routes: Routes = [
    { path: '', component: CatalogueComponent, canActivate:[AuthGuard] }, // Route racine
    { path: 'panier', component: PanierComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: 'profil', component: ProfilComponentComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];