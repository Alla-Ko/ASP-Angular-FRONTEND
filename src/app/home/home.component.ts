import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products$: Observable<Product[]> = new Observable<Product[]>(); // Инициализация пустым Observable
  product: Product = this.resetProduct();
  isEditMode: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(); // Завантажуємо продукти при ініціалізації компонента
  }

  // Завантажуємо продукти, присвоюючи Observable
  loadProducts(): void {
    this.products$ = this.productService.getProducts(); // Присвоюємо Observable
  }

  // Обробка форми для оновлення чи додавання продукту
  onSubmit(): void {
    if (this.isEditMode) {
      // Оновлення продукту
      this.productService
        .updateProduct(this.product.id, this.product)
        .subscribe({
          next: () => {
            this.loadProducts(); // Оновлюємо список після редагування
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Помилка при оновленні продукту:', error);
          },
        });
    } else {
      // Додавання нового продукту
      this.productService.createProduct(this.product).subscribe({
        next: () => {
          this.loadProducts(); // Оновлюємо список після додавання
          this.product = this.resetProduct(); // Скидаємо форму
        },
        error: (error) => {
          console.error('Помилка при додаванні продукту:', error);
        },
      });
    }
  }

  // Режим редагування продукту
  editProduct(product: Product): void {
    this.product = { ...product }; // Копіюємо дані продукту для редагування
    this.isEditMode = true;
  }

  // Видалення продукту
  deleteProduct(id: number): void {
    const confirmed = window.confirm(
      'Ви впевнені, що хочете видалити цей продукт?'
    );
    if (confirmed) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(); // Оновлюємо список після видалення
        },
        error: (error) => {
          console.error('Помилка при видаленні продукту:', error);
        },
      });
    }
  }

  // Скасування редагування
  cancelEdit(): void {
    this.product = this.resetProduct();
    this.isEditMode = false;
  }

  // Скидання продукту
  private resetProduct(): Product {
    return { id: 0, name: '', price: 0, description: '' };
  }
}
