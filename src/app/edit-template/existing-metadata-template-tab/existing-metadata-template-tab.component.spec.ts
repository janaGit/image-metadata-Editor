import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingMetadataTemplateTabComponent } from './existing-metadata-template-tab.component';

describe('ExistingMetadataTemplateTabComponent', () => {
  let component: ExistingMetadataTemplateTabComponent;
  let fixture: ComponentFixture<ExistingMetadataTemplateTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingMetadataTemplateTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingMetadataTemplateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
