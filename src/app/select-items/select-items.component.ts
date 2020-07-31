import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-items',
  templateUrl: './select-items.component.html',
  styleUrls: ['./select-items.component.css', '../css/global-app.css']
})
export class SelectItemsComponent implements OnInit {
  keywords: string[] = [];
  newKeyword = new FormControl('');
  areKeywordsDisabled = false;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeNewKeyword(value) {


  }
  addNewKeyword() {
    const keyword = this.newKeyword.value;
    this.keywords = this.keywords.concat([keyword]);
  }
  deleteKeyword(index: number) {
    this.keywords.splice(index, 1);
    this.keywords = Object.assign([],this.keywords);
  }
}
