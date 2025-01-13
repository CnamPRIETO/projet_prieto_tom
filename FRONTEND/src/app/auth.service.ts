import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterResponse, LoginResponse, UpdateUserResponse } from "./models/auth-response.interface";
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private apiService: ApiService) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.apiService.login(username, password).pipe(
      tap((response: LoginResponse) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  register(username: string,password: string,firstname: string,lastname: string,email: string,address: string,phone: string): Observable<RegisterResponse> {
    return this.apiService.register(username, password, firstname, lastname, email, address, phone);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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
    const token = this.getToken(); // lit le token depuis le localStorage
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
