import { HttpErrorResponse } from '@angular/common/http';

// Turns any HTTP error into a sentence the user can read.
export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No hay conexión con la API. ¿Está encendida? ¿El navegador la bloqueó por CORS?';
    }
    const message = error.error?.message;
    if (Array.isArray(message)) {
      return message.join(' ');
    }
    if (typeof message === 'string') {
      return message;
    }
  }
  return 'Ocurrió un error inesperado.';
}
