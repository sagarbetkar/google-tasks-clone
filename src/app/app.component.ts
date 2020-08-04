import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IList } from './interfaces/list';
import { ListsService } from './services/list/lists.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'google-tasks-clone';
  id: string;
  lists: IList[];

  constructor(private router: Router, private route: ActivatedRoute, private listsService: ListsService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    this.listsService.list().subscribe((lists) => {
      this.lists = lists;
    });
    this.router.navigate([`/${this.id ? this.id : this.lists[0].id}`]);
  }
}
