import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserLocalService {
  private readonly key = 'user_data';

  set(user: User) {
    localStorage.setItem(this.key, JSON.stringify(user));
  }

  get(): User | null {
    const data = localStorage.getItem(this.key);
    return JSON.parse(data || 'null');  
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
