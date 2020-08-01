import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss', '../css/global-app.scss']
})
export class AddItemsComponent implements OnInit {
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
