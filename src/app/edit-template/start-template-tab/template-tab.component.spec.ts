import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTemplateTabComponent } from './start-template-tab.component';

describe('TemplateTabComponent', () => {
  let component: StartTemplateTabComponent;
  let fixture: ComponentFixture<StartTemplateTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartTemplateTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTemplateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
