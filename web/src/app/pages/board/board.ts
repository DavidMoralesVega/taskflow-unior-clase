import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from '../../../environments/environment';
import { errorMessage } from '../../core/error-message';
import { Task } from '../../core/task';

@Component({
  selector: 'app-board',
  imports: [MatCardModule, MatProgressBarModule],
  templateUrl: './board.html',
})
export class Board {
  // GET /api/v1/tasks: Angular makes the request and keeps loading, error and value in signals.
  protected readonly tasks = httpResource<Task[]>(() => `${environment.apiUrl}/v1/tasks`);
  protected readonly errorMessage = errorMessage;
}
