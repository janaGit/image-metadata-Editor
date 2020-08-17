import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemsVerticalComponent } from './add-items-vertical.component';

describe('AddItemsVerticalComponent', () => {
  let component: AddItemsVerticalComponent;
  let fixture: ComponentFixture<AddItemsVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemsVerticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemsVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
