import { Component, OnInit, Output, AfterViewChecked, Input, ElementRef, ViewChild } from '@angular/core';

/**
 * This component realizes a bottom bar that can expand to the whole window.
 */
@Component({
  selector: 'bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss']
})
export class BottomBarComponent implements OnInit, AfterViewChecked {
  @Input() title: string;
  /**
   * Variable that states if the original images should be shown (true)
   * or not (false)
   */
  _showBottomBar: boolean;
  /**
   * Button to open and close the bottom bar
   */
  @ViewChild('button') button: ElementRef;
  /**
   * To set the right size of the inner Bottom Bar, when the bottombar should be
   * opened.
   */
  private _innerBottomBar_height:string;
  constructor() { }

  ngOnInit() {
    this._showBottomBar = false;
  }
  ngAfterViewChecked() {
    if (this._showBottomBar) {
     window.scroll(0, document.documentElement.scrollHeight);
    }
  }
  /**
   * When the bottom are is clicked, this method is called to
   * add/remove a css class to show or hide the bar.
   * 
   * If the bottom bar is open, then the scrollbar of the 
   * whole page is hidden.
   */
  clickBottomBar() {
    let style = document.getElementsByTagName("html")[0].style;

    this._showBottomBar = !this._showBottomBar;
    if (this._showBottomBar) {
      let button_height=this.button.nativeElement.offsetHeight;
      button_height=button_height+8;
      this._innerBottomBar_height="calc(100vh - "+button_height+"px)";
      style.overflowY = "hidden";
    } else {
      style.overflowY = "auto";
    }
  }
}
