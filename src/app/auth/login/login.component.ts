import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserLocalService } from '../../core/services/token.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  auth = inject(AuthService);
  userLocal = inject(UserLocalService);
  router = inject(Router);

  login() {
    this.error = null;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const user = this.userLocal.get();

        if (user?.role === 'admin') {
          this.router.navigate(['/products/list']);
        } else {
          this.router.navigate(['/products/catalog']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión';
      },
    });
  }
}
