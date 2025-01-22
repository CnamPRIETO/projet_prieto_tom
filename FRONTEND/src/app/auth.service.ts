import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterResponse, LoginResponse, UpdateUserResponse } from "./models/auth-response.interface";
import { User } from './models/user';
import { Produit } from './models/produit';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string | null = null;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {}

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  public getProduits(): Observable<Produit[]> {
    const token = this.getToken(); 
    if (!token) {
      throw new Error('Pas de token pour l\'utilisateur connecté');
    }
    return this.apiService.getProduits(token);
  }


  login(username: string, password: string): Observable<LoginResponse> {
    return this.apiService.login(username, password).pipe(
      tap((response: LoginResponse) => {
        if (response.token) {
          this.authToken = response.token;
          this.loggedIn.next(true);
        }
      })
    );
  }

  register(username: string, password: string, firstname: string, lastname: string, email: string, address: string, phone: string): Observable<RegisterResponse> {
    return this.apiService.register(username, password, firstname, lastname, email, address, phone);
  }

  logout(): void {
    this.authToken = null;
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return this.authToken;
  }

  updateUser(userData: User): Observable<UpdateUserResponse> {
    const token = this.getToken();
    if (token) {
      return this.apiService.updateUser(userData, token);
    } else {
      throw new Error('No token found');
    }
  }

  deleteAccount(): Observable<RegisterResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    return this.apiService.deleteUser(token);
  }

  getUserProfile(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    return this.apiService.getUserProfile(token);
  }
}
