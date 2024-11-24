import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = 'http://localhost:5000/api/APIAuth/login';
  constructor(private http: HttpClient) {}

  getToken(user: User): Observable<any> {
    return this.http.post(this.url, user);
  }
}
