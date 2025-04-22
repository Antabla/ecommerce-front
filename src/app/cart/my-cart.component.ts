import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartItem } from '../core/models/cart-item.model';
import { ApiService } from '../core/services/api.service';
import { CartService } from '../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SocketService } from '../core/socket/socket.service';
import { Product } from '../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-my-cart',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './my-cart.component.html',
})
export class MyCartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  cart = inject(CartService);
  api = inject(ApiService);
  router = inject(Router);
  socket = inject(SocketService);

  ngOnInit(): void {
    this.socket
      .listen<Partial<Product>>('stockProductUpdated')
      .subscribe((product) => {
        const item = this.items.find((item) => item.product.id === product.id);
        if (!item) return;
        this.items = this.items.map((item) => {
          if (item.product.id === product.id) {
            return { ...item, product: { ...item.product, stock: product.stock! } };
          }
          return item;
        });
        this.cart.replaceAll(this.items);
        this.total = this.cart.getTotal();
      });
    this.loadCart();
  }

  loadCart(): void {
    this.items = this.cart.getItems();
    this.total = this.cart.getTotal();
  }

  updateQuantity(productId: number, quantity: number, stock: number): void {
    if (quantity < 1) {
      this.cart.removeItem(productId);
    } else if (quantity <= stock) {
      this.items = this.items.map((item) => {
        if (item.product.id === productId) {
          item.quantity = quantity;
        }
        return item;
      });
      this.cart.replaceAll(this.items);
    } else {
      alert('❌ No hay suficiente stock');
      this.items = this.items.map((item) => {
        if (item.product.id === productId) {
          item.quantity = stock;
        }
        return item;
      });
      this.cart.replaceAll(this.items);
    }

    this.loadCart();
  }

  remove(productId: number): void {
    this.cart.removeItem(productId);
    this.loadCart();
  }

  placeOrder(): void {
    const payload = {
      items: this.items.map((item) => ({
        productId: parseInt(item.product.id + ''),
        quantity: parseInt(item.quantity + ''),
        price: parseFloat(item.product.price + ''),
      })),
    };

    this.api.post('/orders', payload).subscribe({
      next: () => {
        alert('✅ ¡Compra realizada con éxito!');
        this.cart.clear();
        this.loadCart();
        this.router.navigate(['/orders']);
      },
      error: () => {
        alert('❌ Error al realizar la compra');
      },
    });
  }
}
