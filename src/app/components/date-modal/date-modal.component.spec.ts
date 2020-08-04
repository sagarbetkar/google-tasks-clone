import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateModalComponent } from './date-modal.component';

describe('DateModalComponent', () => {
  let component: DateModalComponent;
  let fixture: ComponentFixture<DateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
