import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalShowProgressComponent } from './modal-show-progress.component';

describe('ModalShowProgressComponent', () => {
  let component: ModalShowProgressComponent;
  let fixture: ComponentFixture<ModalShowProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalShowProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalShowProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
