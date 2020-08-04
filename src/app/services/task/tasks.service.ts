import { Injectable } from '@angular/core';
import { ITask } from 'src/app/interfaces/task';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor() {}
  items: number = 0;
  private _taskSubject: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>(
    []
  );
  private _taskObserver: Observable<
    ITask[]
  > = this._taskSubject.asObservable().pipe(map((d) => (!d ? [] : d)));

  list(query?: (t: ITask) => boolean) {
    if (query) {
      return this._taskObserver.pipe(map((d) => d.filter((t) => query(t))));
    }
    return this._taskObserver;
  }

  get(id: number) {
    return this._taskObserver.pipe(
      map<ITask[], ITask>((d) => d.find((t) => t.id === id))
    );
  }

  async add(listId: number, data: ITask) {
    const tasks = await this._taskObserver.pipe(take(1)).toPromise();
    data.id = Date.now();
    data.task_title = data.task_title;
    data.task_description = data.task_description;
    data.list_id = listId;
    data.created_at = new Date();
    data.is_completed = false;
    data.due_time = '';
    data.order_id = ++this.items;
    data.modified_at = data.created_at;
    if (data.parent_id && !tasks.find((t) => t.id === data.parent_id)) {
      data.parent_id = null;
    }
    if (data.parent_id === null) {
      tasks.unshift(data);
    } else {
      tasks.push(data);
    }
    return this._taskSubject.next(tasks);
  }

  async update(id: number, data: ITask) {
    const tasks = await this._taskObserver.pipe(take(1)).toPromise();
    const index = tasks.findIndex((t) => t.id === id);
    if (index < 0) {
      throw new Error(`Task with id:${id} not found`);
    }
    const task = tasks[index];
    ['task_title', 'task_description', 'due_date', 'list_id', 'due_time'].forEach((d) => {
      if (data[d]) {
        task[d] = data[d];
      }
    });
    task.modified_at = new Date();
    tasks[index] = task;
    return this._taskSubject.next(tasks);
  }

  async clearDateTime(id: number) {
    const tasks = await this._taskObserver.pipe(take(1)).toPromise();
    const index = tasks.findIndex((t) => t.id === id);
    if (index < 0) {
      throw new Error(`Task with id:${id} not found`);
    }
    const task = tasks[index];
    task.due_date = null;
    task.due_time = null;
    tasks[index] = task;
    return this._taskSubject.next(tasks);
  }
  async updateSubtask(id: number, data: ITask) {
    const tasks = await this._taskObserver.pipe(take(1)).toPromise();
    const index = tasks.findIndex((t) => t.id === id);
    if (index < 0) {
      throw new Error(`Task with id:${id} not found`);
    }
    const task = tasks[index];
    ['task_title', 'task_description', 'due_date', 'due_time'].forEach((d) => {
      if (data[d]) {
        task[d] = data[d];
      }
    });
    if(task.list_id !== data.list_id) {
      task.list_id = data.list_id;
      task.parent_id = null;
    }
    task.modified_at = new Date();
    tasks[index] = task;
    return this._taskSubject.next(tasks);
  }
  async complete(id: number) {
    const tasks = await this._taskObserver.pipe(take(1)).toPromise();
    const index = tasks.findIndex((t) => t.id === id);
    if (index < 0) {
      throw new Error(`Task with id:${id} not found`);
    }
    if (!tasks[index].task_title) {
      return this.delete(tasks[index].id);
    }
    const task = tasks[index];
    task.is_completed = !task.is_completed;
    task.modified_at = new Date();
    tasks[index] = task;
    return this._taskSubject.next(tasks);
  }
  async delete(id: number) {
    const tasks = await this._taskObserver.pipe(take(1)).toPromise();
    const index = tasks.findIndex((t) => t.id === id);
    if (index < 0) {
      throw new Error(`Task with id:${id} not found`);
    }
    tasks.splice(index, 1);
    return this._taskSubject.next(tasks);
  }
  async deleteCompletedTasks(listId: number, completeTasks: ITask[]) {
    const tasks = await this._taskObserver.pipe(take(1)).toPromise();
    for(let ct of completeTasks) {
      const index = tasks.indexOf(ct);
      tasks.splice(index, 1)
    }
    return this._taskSubject.next(tasks);
  }
}
