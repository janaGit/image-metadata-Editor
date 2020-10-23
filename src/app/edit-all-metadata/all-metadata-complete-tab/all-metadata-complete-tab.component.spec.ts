import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMetadataCompleteTabComponent } from './all-metadata-complete-tab.component';

describe('AllMetadataCompleteTabComponent', () => {
  let component: AllMetadataCompleteTabComponent;
  let fixture: ComponentFixture<AllMetadataCompleteTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMetadataCompleteTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMetadataCompleteTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
