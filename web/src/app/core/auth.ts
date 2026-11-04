import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  access_token: string;
}

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly token = signal(localStorage.getItem('token'));
  readonly isLoggedIn = computed(() => this.token() !== null);

  async register(name: string, email: string, password: string) {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/register`, { name, email, password }),
    );
  }

  async login(email: string, password: string) {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }),
    );
    localStorage.setItem('token', response.access_token);
    this.token.set(response.access_token);
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
    this.router.navigate(['/login']);
  }
}
