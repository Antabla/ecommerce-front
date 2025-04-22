import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-save',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-save.component.html',
})
export class ProductSaveComponent implements OnChanges {
  @Input() initialData: Product | null = null;
  @Output() saved = new EventEmitter<Product>();

  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
  };

  api = inject(ApiService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData']?.currentValue) {
      this.product = {
        id: parseInt(changes['initialData'].currentValue.id ?? 0),
        name: changes['initialData'].currentValue.name,
        description: changes['initialData'].currentValue.description,
        price: parseFloat(changes['initialData'].currentValue.price),
        stock: parseInt(changes['initialData'].currentValue.stock),
        image: changes['initialData'].currentValue.image,
      };
    } else {
      this.product = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
      };
    }
  }

  handleImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.product.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    const endpoint = this.product.id
      ? `/products/${this.product.id}`
      : '/products';
    const method = this.product.id ? 'patch' : 'post';

    this.api[method]<Product>(endpoint, this.product).subscribe((res) => {
      this.saved.emit(res);
      this.reset();
    });
  }

  reset(): void {
    this.product = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
    };
  }
}
