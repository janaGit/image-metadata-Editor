import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMetadataFurtherMetadataTabComponent } from './all-metadata-further-metadata-tab.component';

describe('ExistingMetadataTemplateTabComponent', () => {
  let component: AllMetadataFurtherMetadataTabComponent;
  let fixture: ComponentFixture<AllMetadataFurtherMetadataTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMetadataFurtherMetadataTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMetadataFurtherMetadataTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
