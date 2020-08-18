import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMetadataTemplateTabComponent } from './edit-metadata-template-tab.component';

describe('EditMetadataTemplateTabComponent', () => {
  let component: EditMetadataTemplateTabComponent;
  let fixture: ComponentFixture<EditMetadataTemplateTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMetadataTemplateTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMetadataTemplateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
