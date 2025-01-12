import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Produit } from "./models/produit";
import { User } from "./models/user";
import { environment } from "../environments/environments";
import { RegisterResponse, LoginResponse, UpdateUserResponse } from "./models/auth-response.interface";


@Injectable()
export class ApiService{
    constructor (private http: HttpClient) {}
    
    public getProduits(): Observable<Produit[]> {
        return this.http.get<Produit[]>(environment.backendProduit);
    }

    // Authentification
    public register(username: string, password: string): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${environment.backendUser}/auth/register`, { username, password });
    }

    public login(username: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.backendUser}/auth/login`, { username, password });
    }

    public updateUser(userData: User, token: string): Observable<UpdateUserResponse> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put<UpdateUserResponse>(`${environment.backendUser}/auth/user`, userData, { headers });
    }

    public deleteUser(token: string): Observable<RegisterResponse> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete<RegisterResponse>(`${environment.backendUser}/auth/user`, { headers });
    }
}
