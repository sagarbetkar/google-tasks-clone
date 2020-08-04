import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ListViewComponent } from './pages/list-view/list-view.component';
import { AddTaskDetailsComponent } from './pages/add-task-details/add-task-details.component';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: ':id',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: ListViewComponent,
          },
          {
            path: 'edit/:taskId',
            component: AddTaskDetailsComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
