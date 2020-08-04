import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { DateTimeModalComponent } from '../date-time-modal/date-time-modal.component';
import { TasksService } from 'src/app/services/task/tasks.service';
import { ITask } from 'src/app/interfaces/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-date-modal',
  templateUrl: './date-modal.component.html',
  styleUrls: ['./date-modal.component.scss']
})
export class DateModalComponent implements OnInit {
  @ViewChild(DateTimeModalComponent) dateTimeForm: DateTimeModalComponent;
  @Input() eId: string;
  @Output() successEvent: EventEmitter<any> = new EventEmitter<any>();


  constructor(private tasksService: TasksService, public dailogRef: MatDialogRef<DateModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ITask) {}

  ngOnInit(): void {}


  removeDateTime() {
    this.tasksService.clearDateTime(this.data.id);
    this.dailogRef.close();
  }

  close(){
    this.dailogRef.close();
  }

  setDateTime() {
    const res = this.dateTimeForm.onSubmit();
    this.dailogRef.close(res);
  }

}
