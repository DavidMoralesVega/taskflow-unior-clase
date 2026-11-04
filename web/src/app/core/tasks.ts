import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TaskInput } from './task';

// The four CRUD operations. Reading the list lives in the board (httpResource).
@Service()
export class Tasks {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/tasks`;

  create(task: TaskInput) {
    return firstValueFrom(this.http.post<Task>(this.url, task));
  }

  update(id: number, changes: TaskInput) {
    return firstValueFrom(this.http.patch<Task>(`${this.url}/${id}`, changes));
  }

  remove(id: number) {
    return firstValueFrom(this.http.delete<Task>(`${this.url}/${id}`));
  }
}
