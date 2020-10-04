import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTemplateButtonsComponent } from './input-template-buttons.component';

describe('InputTemplateButtonsComponent', () => {
  let component: InputTemplateButtonsComponent;
  let fixture: ComponentFixture<InputTemplateButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTemplateButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTemplateButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
