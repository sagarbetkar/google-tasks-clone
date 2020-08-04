import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { IList } from 'src/app/interfaces/list';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  constructor() {}

  private _listSubject: BehaviorSubject<IList[]> = new BehaviorSubject<IList[]>(
    [
      {
        id: Date.now(),
        name: 'My Tasks',
        created_at: new Date(),
        modified_at: new Date(),
      },
    ]
  );
  private _listObserver: Observable<
    IList[]
  > = this._listSubject.asObservable().pipe(map((d) => (!d ? [] : d)));

  list(query?: (t: IList) => boolean) {
    if (query) {
      return this._listObserver.pipe(map((d) => d.filter((t) => query(t))));
    }
    return this._listObserver;
  }

  get(id: number) {
    return this._listObserver.pipe(
      map<IList[], IList>((d) => d.find((l) => l.id === id))
    );
  }

  async add(data: IList) {
    const lists = await this._listObserver.pipe(take(1)).toPromise();
    data.id = Date.now();
    data.created_at = new Date();
    data.modified_at = data.created_at;
    lists.push(data);
    this._listSubject.next(lists);
    return data;
  }

  async update(id: number, data: IList) {
    const lists = await this._listObserver.pipe(take(1)).toPromise();
    const index = lists.findIndex((t) => t.id === id);
    if (index < 0) {
      throw new Error(`List with id:${id} not found`);
    }
    const list = lists[index];
    list.name = data.name;
    list.modified_at = new Date();
    return this._listSubject.next(lists);
  }

  async delete(id: number) {
    const lists = await this._listObserver.pipe(take(1)).toPromise();
    const index = lists.findIndex((l) => l.id === id);
    if (index < 0) {
      throw new Error(`Task with id:${id} not found`);
    }
    lists.splice(index, 1);
    return this._listSubject.next(lists);
  }
}
