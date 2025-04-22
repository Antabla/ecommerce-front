import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../core/models/order.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-my-orders',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './my-orders.component.html',
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];

  api = inject(ApiService);

  ngOnInit(): void {
    this.api.get<Order[]>('/orders/me').subscribe((res) => {
      this.orders = res;
    });
  }
}
