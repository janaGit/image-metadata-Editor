import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ExifToolService } from 'app/services/exif-tool.service';
import { EditorService } from 'app/services/editor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'modal-show-progress',
  templateUrl: './modal-show-progress.component.html',
  styleUrls: ['./modal-show-progress.component.scss']
})
export class ModalShowProgressComponent implements OnInit, OnDestroy {
  /**
     * Actual status of the modal
     * 
     * shown: true 
     * 
     * not shown: false
     */
  _display: boolean = false;

  _max: number;

  _value: number;

  _title: string;

  private _progessSubscription: Subscription;
  /**
 * This method sets the value for the visibility of the modal.
 * 
 * true: visible
 * 
 * false: hidden
 */
  set display(display: boolean) {
    this._display = display;
  }
  /**
 * The status if the modal is visible of hidden can be 
 * externally defined and changed.
 */
  get display() {
    return this._display;
  }


  constructor(private _editorService: EditorService, private _cdr: ChangeDetectorRef) {

  }

  ngOnDestroy() {
    this._progessSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this._progessSubscription = this._editorService._progress_value$.subscribe(newProgress => {
      if (newProgress) {
        this._value = newProgress.value;
        this._max = newProgress.max;
        this._title = newProgress.title;
        if (newProgress.value === newProgress.max) {
          this.display = false;
        } else {
          if (newProgress.value < newProgress.max) {
            this.display = true;
          }

        }
        this._cdr.detectChanges();
      }
    });
  }

}
