import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ITask } from 'src/app/interfaces/task';

@Component({
  selector: 'app-date-time-modal',
  templateUrl: './date-time-modal.component.html',
  styleUrls: ['./date-time-modal.component.scss'],
})
export class DateTimeModalComponent implements OnInit, OnChanges, OnDestroy {
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  dateTimeForm: FormGroup;
  @Input() task: ITask;
  selectedDate;
  hours = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.updateForm();
    for (let hour = 0; hour < 24; hour++) {
      this.hours.push(moment({ hour }).format('h:mm A'));
      this.hours.push(
        moment({
          hour,
          minute: 30,
        }).format('h:mm A')
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.task = changes['task'].currentValue;
    this.updateForm();
  }

  onValueChange(event) {
    this.selectedDate = event;
    this.dateTimeForm.setValue({
      date: this.selectedDate,
      time: this.task.due_time || '',
    });
  }

  updateForm() {
    this.dateTimeForm = this.fb.group({
      date: this.selectedDate,
      time: '',
    });
    if (this.task) {
      this.selectedDate = this.task.due_date;
      this.dateTimeForm.setValue({
        date: this.task.due_date || null,
        time: this.task.due_time || '',
      });
    }
  }

  onSubmit() {
    return {
      due_date: this.dateTimeForm.value.date,
      due_time: this.dateTimeForm.value.time,
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }
}
