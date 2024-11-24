import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../models/product';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url: string = 'http://localhost:5000/api/APIproducts';
  private token: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Метод для отримання токену як Observable
  getToken(): Observable<any> {
    const user = { email: 'alla@aa', password: 'alla12345' };
    return this.authService.getToken(user); // Повертаємо Observable
  }

  // Метод для виконання запиту на продукти
  getProducts(): Observable<Product[]> {
    return this.getToken().pipe(
      switchMap((data) => {
        this.token = data.token; // Зберігаємо токен
        return this.http.get<Product[]>(this.url, {
          headers: this.getHeaders(),
        });
      })
    );
  }

  // Метод для отримання заголовків з токеном
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  // Інші методи для взаємодії з продуктами
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, product, {
      headers: this.getHeaders(),
    });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product, {
      headers: this.getHeaders(),
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
