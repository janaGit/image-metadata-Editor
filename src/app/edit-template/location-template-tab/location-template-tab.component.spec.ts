import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTemplateTabComponent } from './location-template-tab.component';

describe('LocationTemplateTabComponent', () => {
  let component: LocationTemplateTabComponent;
  let fixture: ComponentFixture<LocationTemplateTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationTemplateTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTemplateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
