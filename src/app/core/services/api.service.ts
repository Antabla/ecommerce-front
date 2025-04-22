import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = 'http://localhost:3000';

  http = inject(HttpClient);

  get<T>(url: string) {
    return this.http.get<T>(this.base + url);
  }

  post<T>(url: string, data: any) {
    return this.http.post<T>(this.base + url, data);
  }

  patch<T>(url: string, data: any) {
    return this.http.patch<T>(this.base + url, data);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(this.base + url);
  }
}
