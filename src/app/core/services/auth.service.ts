import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserLocalService } from './token.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000/auth';

  http = inject(HttpClient);
  userLocal = inject(UserLocalService);

  login(email: string, password: string) {
    return this.http
      .post<User>(`${this.baseUrl}/login`, { email, password })
      .pipe(tap((res) => this.userLocal.set(res)));
  }

  register(name: string, email: string, password: string) {
    return this.http
      .post<User>(`${this.baseUrl}/register`, { name, email, password })
      .pipe(tap((res) => this.userLocal.set(res)));
  }

  logout() {
    this.userLocal.clear();
  }

  isAdminAuthenticated(): boolean {
    const user = this.userLocal.get();
    return !!user && user.role === 'admin';
  }

  isAuthenticated(): boolean {
    return !!this.userLocal.get();
  }
}
