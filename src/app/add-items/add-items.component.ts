import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss', '../css/global-app.scss']
})
export class AddItemsComponent implements OnInit {

  newKeyword = new FormControl('');
  @Input() areKeywordsDisabled = false;
 
  private _keywords = [];
  @Input()
  set keywords(keywords) {
    if (keywords) {
      this._keywords = keywords;
    }
  }
  get keywords() {
    return this._keywords;
  }

  @Output() keywordsChange = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit(): void {
  }

  onChangeNewKeyword(value) {


  }
  addNewKeyword() {
    const keyword = this.newKeyword.value;
    this.keywords = this.keywords.concat([keyword]);
    this.keywordsChange.emit(this.keywords);
    this.newKeyword.setValue("");
  }
  deleteKeyword(index: number) {
    this.keywords.splice(index, 1);
    this.keywords = Object.assign([], this.keywords);
    this.keywordsChange.emit(this.keywords);
  }
}
