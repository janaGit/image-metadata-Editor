import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesTemplateTabComponent } from './categories-template-tab.component';

describe('CategoriesTemplateTabComponent', () => {
  let component: CategoriesTemplateTabComponent;
  let fixture: ComponentFixture<CategoriesTemplateTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesTemplateTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesTemplateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
