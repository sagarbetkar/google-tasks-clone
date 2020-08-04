import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IList } from 'src/app/interfaces/list';
import { ListsService } from 'src/app/services/list/lists.service';
import { Subject } from 'rxjs';
import { UikitModal } from 'src/app/classes/uikit-modal';
import { TasksService } from 'src/app/services/task/tasks.service';
import { ITask } from 'src/app/interfaces/task';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateModalComponent } from 'src/app/components/date-modal/date-modal.component';

@Component({
  selector: 'app-add-task-details',
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  templateUrl: './add-task-details.component.html',
  styleUrls: ['./add-task-details.component.scss'],
})
export class AddTaskDetailsComponent implements OnInit, OnDestroy {
  location: Location;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private listsService: ListsService,
    private router: Router,
    public dailog: MatDialog,
    location: Location
  ) {
    this.location = location;
  }

  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  addTaskDetailsForm: FormGroup;
 /*  @ViewChild(DateTimeModalComponent) dateTimeForm: DateTimeModalComponent; */
  listId: number;
  taskId: number;
  task: ITask;
  tasks: ITask[];
  lists: IList[];
  list: IList;
  due_date: Date;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.listId = Number(this.location.path().split('/')[1]);
      this.taskId = Number(params.taskId);
    });

    this.addTaskDetailsForm = this.fb.group({
      task_title: [''],
      task_description: [''],
      list: [''],
      due_date: '',
      due_time: '',
    });

    this.listsService.list().subscribe((lists) => {
      this.lists = lists;
    });
    this.listsService.get(this.listId).subscribe((list) => {
      this.list = list;
    });
    this.tasksService.get(this.taskId).subscribe((data) => {
      this.task = data;
    });
    this.tasksService
      .list(
        (task) => task.parent_id === this.taskId && task.is_completed === false
      )
      .subscribe((data) => {
        this.tasks = data;
      });
    this.addTaskDetailsForm.setValue({
      task_title: this.task.task_title || '',
      task_description: this.task.task_description || '',
      list: this.list.id || '',
      due_date: this.task.due_date || '',
      due_time: this.task.due_time || '',
    });
    this.onChanges();
  }

  addSubTaskInput() {
    this.tasksService.add(this.listId, {
      task_title: '',
      task_description: '',
      parent_id: this.taskId,
      list_id: this.listId,
    });
  }

  openCalendarModal() {
    /* UikitModal.show('#dateTimeModal'); */
    const dialogRef = this.dailog.open(DateModalComponent, {
      width: '268px',
      data: this.task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTaskDetailsForm.patchValue({
          due_date: result.due_date,
          due_time: result.due_time,
        });
      }
    });
  }

  /* addResData(event) {
    if (event) {
      this.addTaskDetailsForm.patchValue({
        due_date: event.due_date,
        due_time: event.due_time,
      });
    }
  } */

  /* setDateTime() {
    const res = this.dateTimeForm.onSubmit();
    if (res) {
      this.addTaskDetailsForm.patchValue({
        due_date: res.due_date,
        due_time: res.due_time,
      });
    }
    UIkit.modal('#my-id').$destory(true);
  }

  removeDateTime() {
    this.tasksService.clearDateTime(this.task.id);
    UIkit.modal('#my-id').$destory(true);
  } */

  clearInput() {
    this.addTaskDetailsForm.patchValue({
      due_date: null,
      due_time: null,
    });
    this.tasksService.clearDateTime(this.taskId);
  }

  onChanges() {
    this.addTaskDetailsForm.valueChanges.subscribe((val) => {
      if (this.task.parent_id) {
        this.tasksService.updateSubtask(this.taskId, {
          task_title: val.task_title,
          task_description: val.task_description,
          list_id: Number(val.list),
          due_date: val.due_date,
        });
      } else {
        this.tasksService.update(this.taskId, {
          task_title: val.task_title,
          task_description: val.task_description,
          list_id: Number(val.list),
          due_date: val.due_date,
          due_time: val.due_time,
        });
      }
    });
  }

  deleteTask() {
    this.tasksService.delete(this.taskId);
    this.router.navigate([`/${this.listId ? this.listId : this.lists[0].id}`]);
  }

  goback() {
    this.location.back();
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }
}
