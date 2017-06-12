import { Component, OnInit, Output, AfterViewChecked } from '@angular/core';

/**
 * This component realizes a bottom bar that can expand to the whole window.
 */
@Component({
  selector: 'bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit, AfterViewChecked {
  /**
   * Variable that states if the original images should be shown (true)
   * or not (false)
   */
  private showOriginalImages: boolean;
  constructor() { }

  ngOnInit() {
    this.showOriginalImages = false;
  }
  ngAfterViewChecked() {
    if (this.showOriginalImages) {
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

    this.showOriginalImages = !this.showOriginalImages;
    if (this.showOriginalImages) {
      style.overflowY = "hidden";
    } else {
      style.overflowY = "auto";
    }
  }
}
