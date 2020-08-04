import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IList } from 'src/app/interfaces/list';
import { ListsService } from 'src/app/services/list/lists.service';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ITask } from 'src/app/interfaces/task';
import { ListModalComponent } from 'src/app/components/list-modal/list-modal.component';
declare var UIkit;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  @ViewChild(ListModalComponent) child: ListModalComponent;
  @Output() listChangeEvent = new EventEmitter<IList>();
  addListsForm: FormGroup;
  lists: IList[];
  list: IList;
  tasks: ITask[];
  id: number;
  isEditing: boolean = false;

  constructor(
    private listsService: ListsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.listsService.get(Number(params['id'])).subscribe((list) => this.list = list)
    });
    this.updateList();
  }

  updateList() {
    this.listsService.list().subscribe((lists) => {
      this.lists = lists;
    });
    // this.list = this.lists[0];
  }

  async onAddList() {
    const res: any = await this.child.onSubmit();
    this.listsService.get(res.id).subscribe((data) => {
      if(data){
        this.list = data;
        this.onChanges(data);
        this.router.navigate([`/${data.id}`]);
      }
    });
    UIkit.modal('#modal-sections').hide();
  }

  onChanges(list: IList): void {
    this.listChangeEvent.emit(list);
    this.list = list;
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }
}
