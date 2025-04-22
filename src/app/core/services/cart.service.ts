import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly key = 'cart_items';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.load());
  cartItems$ = this.cartItemsSubject.asObservable();

  private load(): CartItem[] {
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : [];
  }

  private save(items: CartItem[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.cartItemsSubject.next(items); // Emitir los cambios
  }

  getItems(): CartItem[] {
    return this.load();
  }

  replaceAll(items: CartItem[]): void {
    this.save(items);
  }

  addItem(product: Product, quantity: number = 1): void {
    const items = this.load();
    const existing = items.find((i) => i.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    this.save(items);
  }

  removeItem(productId: number): void {
    const updated = this.load().filter((i) => i.product.id !== productId);
    this.save(updated);
  }

  clear(): void {
    localStorage.removeItem(this.key);
    this.cartItemsSubject.next([]); // Emitir un carrito vacío
  }

  getTotal(): number {
    return this.load().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}