import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: 'register.component.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error: string | null = null;

  auth = inject(AuthService);
  router = inject(Router);

  register() {
    this.error = null;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse';
      },
    });
  }
}
