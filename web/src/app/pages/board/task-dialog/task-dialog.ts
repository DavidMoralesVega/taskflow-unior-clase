import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { errorMessage } from '../../../core/error-message';
import { Task } from '../../../core/task';
import { Tasks } from '../../../core/tasks';

// One dialog for both cases: without data it creates, with a task it edits.
@Component({
  selector: 'app-task-dialog',
  imports: [FormRoot, FormField, MatDialogModule, MatInputModule, MatButtonModule],
  templateUrl: './task-dialog.html',
})
export class TaskDialog {
  private readonly tasks = inject(Tasks);
  private readonly dialogRef = inject(MatDialogRef<TaskDialog>);
  protected readonly task = inject<Task | null>(MAT_DIALOG_DATA);

  protected readonly error = signal('');
  protected readonly model = signal({
    title: this.task?.title ?? '',
    description: this.task?.description ?? '',
  });

  protected readonly taskForm = form(
    this.model,
    (path) => {
      required(path.title, { message: 'El título es obligatorio.' });
      minLength(path.title, 3, { message: 'El título debe tener al menos 3 caracteres.' });
      maxLength(path.title, 100, { message: 'El título no puede superar los 100 caracteres.' });
    },
    {
      submission: {
        action: async () => {
          this.error.set('');
          try {
            if (this.task) {
              await this.tasks.update(this.task.id, this.model());
            } else {
              await this.tasks.create(this.model());
            }
            this.dialogRef.close(true);
          } catch (error) {
            this.error.set(errorMessage(error));
          }
        },
      },
    },
  );
}
