import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { ApiService } from '../../core/services/api.service';
import { ProductSaveComponent } from '../save/product-save.component';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SocketService } from '../../core/socket/socket.service';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, ProductSaveComponent, NavbarComponent],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;

  api = inject(ApiService);
  router = inject(Router);
  socket = inject(SocketService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.api.get<Product[]>('/products').subscribe((res) => {
      this.products = res;
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

  goModeCatalog(): void {
    this.router.navigate(['/products/catalog']);
  }

  openModalForCreate(): void {
    this.selectedProduct = null;
    this.showModal();
  }

  openModalForEdit(product: Product): void {
    this.selectedProduct = { ...product };
    this.showModal();
  }

  onProductSaved(product: Product): void {
    const index = this.products.findIndex((p) => p.id === product.id);

    if (index !== -1) {
      this.products[index] = product; // Actualización
    } else {
      this.products.push(product); // Nuevo
    }

    this.hideModal();
  }

  delete(productId: number): void {
    if (confirm('¿Eliminar este producto?')) {
      this.api.delete(`/products/${productId}`).subscribe(() => {
        this.products = this.products.filter((p) => p.id !== productId);
      });
    }
  }

  private showModal(): void {
    const modal = document.getElementById('productModal');
    if (modal) {
      const bs = (window as any).bootstrap.Modal.getOrCreateInstance(modal);
      bs.show();
    }
  }

  private hideModal(): void {
    const modal = document.getElementById('productModal');
    if (modal) {
      const bs = (window as any).bootstrap.Modal.getInstance(modal);
      bs?.hide();
    }
  }
}
