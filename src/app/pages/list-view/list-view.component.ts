import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IList } from 'src/app/interfaces/list';
import { Subject } from 'rxjs';
import { ListsService } from 'src/app/services/list/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from 'src/app/services/task/tasks.service';
import { ITask } from 'src/app/interfaces/task';
import { ListModalComponent } from 'src/app/components/list-modal/list-modal.component';
declare var UIkit;

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    private tasksService: TasksService,
    private listsService: ListsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  @ViewChild(ListModalComponent) renameListForm: ListModalComponent;
  list: IList;
  lists: IList[];
  tasks: ITask[];
  tasksCompleted: ITask[];
  id: number;
  isActive: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this.listsService.get(this.id).subscribe((list) => {
        this.list = list;
      });
      this.listsService.list().subscribe((lists) => {
        this.lists = lists;
      });
      this.updateTasks();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.list = changes['list'].currentValue;
    this.updateTasks();
  }

  updateTasks() {
    this.tasksService
      .list(
        (task) =>
          task.list_id === this.list.id &&
          task.is_completed === false &&
          task.parent_id === null
      )
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
    this.tasksService
      .list(
        (task) => task.list_id === this.list.id && task.is_completed === true
      )
      .subscribe((tasks) => {
        this.tasksCompleted = tasks;
      });
  }

  addTaskInput(): void {
    this.tasksService.add(this.list.id, { task_title: '', parent_id: null });
  }

  redoTask(id: number): void {
    this.tasksService.complete(id);
  }

  getTasks() {
    this.isActive = false;
    this.tasksService
    .list(
      (task) =>
        task.list_id === this.list.id &&
        task.is_completed === false &&
        task.parent_id === null
    )
    .subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  deleteAllCompletedTask(completedTasks): void {
    this.tasksService.deleteCompletedTasks(this.list.id, completedTasks);
  }

  deleteCompletedTask(id) {
    this.tasksService.delete(id);
  }

  renameList() {
    this.renameListForm.updateListName();
    UIkit.modal('#rename-modal-sections').hide();
  }

  deleteList(listId: number) {
    if (this.lists.length > 1) {
      this.listsService.delete(listId);
      this.listsService.list().subscribe((data) => {
        this.lists = data;
      });
      this.router.navigate([`/${this.lists[0].id}`]);
    } else {
      UIkit.notification('You cannot removed last list.', {
        status: 'primary',
      });
    }
  }

  sortByDueDate() {
    this.isActive = true;
    return this.tasks.sort(
      (a, b) => (a.due_date ? a.due_date.getDate() : a.created_at.getDate()) - (b.due_date ? b.due_date.getDate() : b.created_at.getDate())
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }
}
