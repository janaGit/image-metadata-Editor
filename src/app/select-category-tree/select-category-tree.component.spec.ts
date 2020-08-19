import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCategoryTreeComponent } from './select-category-tree.component';

describe('SelectCategoryTreeComponent', () => {
  let component: SelectCategoryTreeComponent;
  let fixture: ComponentFixture<SelectCategoryTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCategoryTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCategoryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
