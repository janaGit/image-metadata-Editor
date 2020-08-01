import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
* Different values for the css display variable.
*/
type css_display = 'block' | 'none'

@Component({
  selector: 'app-modal',
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss']
})
export class AppModalComponent implements OnInit {
  /**
 * Actual value of css:display 
 */
  _display_css: css_display = 'none';
  /**
* Actual status of the modal
* 
* shown: true 
* 
* not shown: false
*/
  private _display: boolean = false;

  @Input("title") _title: string;
  /**
 * The status if the modal is visible of hidden can be 
 * externally defined and changed.
 */
  @Input() get display() {
    return this._display;
  }
  /**
 * Event emitter that informs other components about the
 * actual status (shown/hidden) of the modal.
 */
  @Output() displayChange = new EventEmitter<boolean>();
  /**
     * This method sets the value for the visibility of the modal.
     * 
     * If the modal should be shown, then the metadata of the actual image 
     * are requested and bind to the local metadata variable.
     * 
     * true: visible
     * 
     * false: hidden
     */
  set display(display: boolean) {
    //actualize _display variable
    this._display = display;
    this.displayChange.emit(this._display);

    if (this._display == false) {
      this._display_css = 'none';
    } else {
      this._display_css = 'block';
    }
  }

  constructor() { }

  ngOnInit(): void {
    // To get sure that _display and _display_css are synchonized. 
    this.display = this._display;
  }


}
