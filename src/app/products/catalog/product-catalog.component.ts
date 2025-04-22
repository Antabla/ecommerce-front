import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CartItem } from '../../core/models/cart-item.model';
import { SocketService } from '../../core/socket/socket.service';

@Component({
  standalone: true,
  selector: 'app-product-catalog',
  imports: [CommonModule, NavbarComponent],
  templateUrl: 'product-catalog.component.html',
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  productOnCart: CartItem[] = [];

  api = inject(ApiService);
  cart = inject(CartService);
  socket = inject(SocketService);

  ngOnInit(): void {
    this.api.get<Product[]>('/products').subscribe((res) => {
      this.products = res;
    });

    this.cart.cartItems$.subscribe((res) => {
      console.log('🛒 Items en el carrito:', res);
      this.productOnCart = res;
    });

    this.socket
    .listen<Partial<Product>>('stockProductUpdated')
    .subscribe((product) => {
      console.log('🛒 Stock actualizado:', product);
      this.products = this.products.map((p) => {
        if (p.id === product.id) {
          return { ...p, stock: product.stock! };
        }
        return p;
      });
    });
  }

  getTotalItemOnCart(id: number): number {
    const item = this.productOnCart.find((item) => item.product.id === id);
    if (item) {
      return item.quantity;
    }
    return 0;
  }

  addToCart(product: Product) {
    console.log('🛒 Agregar al carrito:', product.name);
    this.cart.addItem(product);
  }
}
