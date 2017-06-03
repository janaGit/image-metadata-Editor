import { Component, OnInit } from '@angular/core';
/**
 * This component realizes a bottom bar that can expand to the whole window.
 */
@Component({
  selector: 'bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit {
  /**
   * Variable that states if the original images should be shown (true)
   * or not (false)
   */
  private showOriginalImages: boolean;

  ngOnInit() {
    this.showOriginalImages = false;
  }
  /**
   * When the bottom are is clicked, this method is called to
   * add/remove a css class to show or hide the bar.
   */
  clickBottomBar() {
    this.showOriginalImages = !this.showOriginalImages;
  }
}
