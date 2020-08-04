import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListsService } from 'src/app/services/list/lists.service';
import { IList } from 'src/app/interfaces/list';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss']
})
export class ListModalComponent implements OnInit, OnDestroy, OnChanges {
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  addListsForm: FormGroup;
  @Input() list: IList;
  constructor(private listsService: ListsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.updateForm()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.list = changes['list'].currentValue;
    this.updateForm()
  }

  updateForm() {
    this.addListsForm = this.fb.group({
      list: '',
    });
    if(this.list) {
      this.addListsForm.setValue({
        list: this.list.name,
      });
    }
  }

  async onSubmit() {
    if (this.addListsForm.valid) {
      const res = await this.listsService.add({
        name: this.addListsForm.value.list,
      });
      this.addListsForm.reset();
      return res;
    }
  }
  
  updateListName() {
    return this.listsService.update(this.list.id, {name: this.addListsForm.value.list});
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }
}
