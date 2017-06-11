import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomBarOriginalImgComponent } from './bottom-bar-original-img.component';

describe('BottomBarComponent', () => {
  let component: BottomBarOriginalImgComponent;
  let fixture: ComponentFixture<BottomBarOriginalImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomBarOriginalImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomBarOriginalImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
