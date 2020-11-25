import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksBlockComponent } from './tasks-block.component';

describe('TasksBlockComponent', () => {
  let component: TasksBlockComponent;
  let fixture: ComponentFixture<TasksBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
