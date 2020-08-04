import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { UikitModal } from 'src/app/classes/uikit-modal';
import { DateTimeModalComponent } from '../date-time-modal/date-time-modal.component';
import { TasksService } from 'src/app/services/task/tasks.service';
import { ITask } from 'src/app/interfaces/task';


@Component({
  selector: 'app-date-modal',
  templateUrl: './date-modal.component.html',
  styleUrls: ['./date-modal.component.scss']
})
export class DateModalComponent extends UikitModal implements OnInit, OnChanges, OnDestroy {
  @ViewChild(DateTimeModalComponent) dateTimeForm: DateTimeModalComponent;
  @Input() eId: string;
  @Input() data: ITask;
  @Output() hide: EventEmitter<void> = new EventEmitter<void>();
  @Output() success: EventEmitter<any> = new EventEmitter<any>();
  @Output() error: EventEmitter<any> = new EventEmitter<any>(); 

  constructor(private tasksService: TasksService ) {
    super();
  }

  ngOnInit(): void {
    this._elementId = this.eId;
    super.OnInit();
    console.log(this.data);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // this.data = changes['data'].currentValue;
    this._elementId = changes.eId.currentValue;
  }

  ngOnDestroy() {
    super.OnDestroy();
  }

  removeDateTime() {
    this.tasksService.clearDateTime(this.data.id);
    this.close();
  }

  setDateTime() {
    const res = this.dateTimeForm.onSubmit();
    console.log(res);
    if (res) {
      this.success.emit(res)
    }
    this.close();
  }

}
