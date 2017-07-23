import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomBarCompleteImgComponent } from './bottom-bar-complete-img.component';

describe('BottomBarCompleteImgComponent', () => {
  let component: BottomBarCompleteImgComponent;
  let fixture: ComponentFixture<BottomBarCompleteImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomBarCompleteImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomBarCompleteImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
