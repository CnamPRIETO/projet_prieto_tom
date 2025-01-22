import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Produit } from "./models/produit";
import { User } from "./models/user";
import { environment } from "../environments/environments";
import { RegisterResponse, LoginResponse, UpdateUserResponse } from "./models/auth-response.interface";


@Injectable()
export class ApiService{
    constructor (private http: HttpClient) {}
    


    public searchProduits(criteria: {ref?: string, description?: string, prix?: number}, token: string): Observable<Produit[]> {
        let params = new HttpParams();
        
        if (criteria.ref) {
            params = params.set('ref', criteria.ref);
        }
        
        if (criteria.description) {
            params = params.set('description', criteria.description);
        }
        
        if (criteria.prix !== undefined && criteria.prix !== null) {
            params = params.set('prix', criteria.prix.toString());
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Produit[]>(environment.backendProduit, { params, headers });
    }

    public getProduits(token: string): Observable<Produit[]> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Produit[]>(environment.backendProduit, { headers });
      }

    // Authentification
    public register(username: string, password: string,firstname: string,lastname: string,email: string,address: string,phone: string): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${environment.backendUser}/auth/register`,{username,password,firstname,lastname,email,address,phone}
        );
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

    public getUserProfile(token: string): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<User>(`${environment.backendUser}/auth/user`, { headers });
    }
}
