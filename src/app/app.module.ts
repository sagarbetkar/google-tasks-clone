import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { LayoutComponent } from './pages/layout/layout.component';
import { AddTaskDetailsComponent } from './pages/add-task-details/add-task-details.component';
import { ListViewComponent } from './pages/list-view/list-view.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { ListModalComponent } from './components/list-modal/list-modal.component';
import { DateTimeModalComponent } from './components/date-time-modal/date-time-modal.component';
import { DateModalComponent } from './components/date-modal/date-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    DateAgoPipe,
    AutoFocusDirective,
    LayoutComponent,
    AddTaskDetailsComponent,
    ListViewComponent,
    TaskFormComponent,
    ListModalComponent,
    DateTimeModalComponent,
    DateModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
