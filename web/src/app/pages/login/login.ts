import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth';
import { errorMessage } from '../../core/error-message';

@Component({
  selector: 'app-login',
  imports: [FormRoot, FormField, RouterLink, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly credentials = signal({ email: '', password: '' });

  protected readonly loginForm = form(
    this.credentials,
    (path) => {
      required(path.email, { message: 'Escribe tu correo.' });
      email(path.email, { message: 'El correo no es válido.' });
      required(path.password, { message: 'Escribe tu contraseña.' });
    },
    {
      submission: {
        action: async () => {
          this.error.set('');
          try {
            const { email, password } = this.credentials();
            await this.auth.login(email, password);
            await this.router.navigate(['/']);
          } catch (error) {
            this.error.set(errorMessage(error));
          }
        },
      },
    },
  );
}
