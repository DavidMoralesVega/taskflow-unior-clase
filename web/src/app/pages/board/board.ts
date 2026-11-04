import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { errorMessage } from '../../core/error-message';
import { Task, TaskStatus } from '../../core/task';
import { Tasks } from '../../core/tasks';
import { TaskDialog } from './task-dialog/task-dialog';

@Component({
  selector: 'app-board',
  imports: [
    CdkDropListGroup, CdkDropList, CdkDrag,
    MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule,
  ],
  templateUrl: './board.html',
})
export class Board {
  private readonly api = inject(Tasks);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // GET /api/v1/tasks: Angular makes the request and keeps loading, error and value in signals.
  protected readonly tasks = httpResource<Task[]>(() => `${environment.apiUrl}/v1/tasks`);
  protected readonly errorMessage = errorMessage;

  protected readonly columns: { status: TaskStatus; title: string }[] = [
    { status: 'TODO', title: 'Por hacer' },
    { status: 'IN_PROGRESS', title: 'En curso' },
    { status: 'DONE', title: 'Terminado' },
  ];

  // The tasks of each column, recalculated every time the list changes.
  protected readonly byStatus = computed(() => {
    const list = this.tasks.hasValue() ? this.tasks.value() : [];
    return {
      TODO: list.filter((task) => task.status === 'TODO'),
      IN_PROGRESS: list.filter((task) => task.status === 'IN_PROGRESS'),
      DONE: list.filter((task) => task.status === 'DONE'),
    };
  });

  protected openDialog(task: Task | null = null) {
    this.dialog
      .open(TaskDialog, { data: task, width: '480px' })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          this.tasks.reload();
        }
      });
  }

  // Drag & drop: the card moves on screen first, then the API is told (optimistic update).
  protected async move(event: CdkDragDrop<TaskStatus>) {
    const task: Task = event.item.data;
    const status = event.container.data;
    if (task.status === status) {
      return;
    }
    this.tasks.update((list) => list?.map((t) => (t.id === task.id ? { ...t, status } : t)));
    try {
      await this.api.update(task.id, { status });
    } catch (error) {
      this.snackBar.open(errorMessage(error), 'Cerrar');
      this.tasks.reload();
    }
  }

  protected async remove(task: Task) {
    try {
      await this.api.remove(task.id);
      this.snackBar.open(`Se eliminó «${task.title}»`, 'Cerrar', { duration: 3000 });
      this.tasks.reload();
    } catch (error) {
      this.snackBar.open(errorMessage(error), 'Cerrar');
    }
  }
}
