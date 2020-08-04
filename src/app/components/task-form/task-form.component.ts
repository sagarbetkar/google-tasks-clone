import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IList } from 'src/app/interfaces/list';
import { Subject } from 'rxjs';
import { DateTimeModalComponent } from '../date-time-modal/date-time-modal.component';
import { UikitModal } from 'src/app/classes/uikit-modal';
import { ITask } from 'src/app/interfaces/task';
import { TasksService } from 'src/app/services/task/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { DateModalComponent } from '../date-modal/date-modal.component';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit, OnChanges, OnDestroy {
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  @ViewChild(DateTimeModalComponent) dateTimeForm: DateTimeModalComponent;
  addTasksForm: FormGroup;
  @Input() list: IList;
  @Input() task: ITask;
  tasks: ITask[];
  @Input() isChild: boolean = false;
  @Input() inEdit: boolean;
  constructor(private fb: FormBuilder, private tasksService: TasksService, public dailog: MatDialog) {}

  ngOnInit(): void {
    if(this.isChild) {
      this.isChild = true;
    }
    if(this.inEdit) {
      this.inEdit = true;
    }
    this.addTasksForm = this.fb.group({
      isCompleted: false,
      task_title: [''],
    });
    this.addTasksForm.patchValue({
      isCompleted: this.task.is_completed,
      task_title: this.task.task_title,
    });
    this.tasksService
      .list(
        (task) =>
          task.parent_id === this.task.id && task.is_completed === false
      )
      .subscribe((tasks) => {
        this.tasks = tasks;
      });

    this.onChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.list = changes['list'].currentValue;
    this.task = changes['task'].currentValue;
  }

  onChanges() {
    this.addTasksForm.valueChanges.subscribe((val) => {
      // setInterval(() => {
      this.tasksService.update(this.task.id, { task_title: val.task_title });
      // }, 10);
      if (val.isCompleted) {
        this.completedTask(this.task.id);
      }
    });
  }

  async completedTask(id: number) {
    await this.tasksService.complete(id);
  }

  openModal() {
    const dialogRef = this.dailog.open(DateModalComponent, {
      width: '268px',
      data: this.task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.update(this.task.id, {
          due_date: result.due_date,
          due_time: result.due_time,
        });
      }
    });
  }

  addResData(event) {
    if (event) {
      this.tasksService.update(this.task.id, event);
    }
  }

  /* setDateTime() {
    const res = this.dateTimeForm.onSubmit();
    this.tasksService.update(this.task.id, res);
    UIkit.modal('#my-dateTime').hide()
  }

  removeDateTime() {
    this.tasksService.clearDateTime(this.task.id);
    UIkit.modal('#my-dateTime').hide()
  } */

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }
}
