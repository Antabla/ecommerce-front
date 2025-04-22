import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { UserLocalService } from '../../core/services/token.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  user: any = null;
  cartCount = 0;

  userLocal = inject(UserLocalService);
  cart = inject(CartService);
  router = inject(Router);

  ngOnInit(): void {
    this.user = this.userLocal.get();
    this.cart.cartItems$.subscribe((items) => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  logout(): void {
    this.userLocal.clear();
    this.router.navigate(['/auth/login']);
  }
}
