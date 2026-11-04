import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth';
import { errorMessage } from '../../core/error-message';

@Component({
  selector: 'app-register',
  imports: [FormRoot, FormField, RouterLink, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly account = signal({ name: '', email: '', password: '' });

  // The same rules the API checks with class-validator (RegisterDto).
  protected readonly registerForm = form(
    this.account,
    (path) => {
      required(path.name, { message: 'Escribe tu nombre.' });
      minLength(path.name, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });
      required(path.email, { message: 'Escribe tu correo.' });
      email(path.email, { message: 'El correo no es válido.' });
      required(path.password, { message: 'Escribe una contraseña.' });
      minLength(path.password, 10, { message: 'La contraseña debe tener al menos 10 caracteres.' });
    },
    {
      submission: {
        action: async () => {
          this.error.set('');
          try {
            const { name, email, password } = this.account();
            await this.auth.register(name, email, password);
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
