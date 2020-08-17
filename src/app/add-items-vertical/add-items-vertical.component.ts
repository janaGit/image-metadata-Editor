import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-items-vertical',
  templateUrl: './add-items-vertical.component.html',
  styleUrls: ['./add-items-vertical.component.scss']
})
export class AddItemsVerticalComponent implements OnInit {

  newItem = new FormControl('');

  areItemsDisabled = false;

  private _items: string[] = [];

  @Input() title: string = "Item";

  @Input()
  set items(items) {
    if (items) {
      this._items = items;
    }
  }

  get items() {
    return this._items;
  }

  @Output() itemsChange = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit(): void {
  }

  onChangeNewItem(value) {


  }
  addNewItem() {
    const item = this.newItem.value;
    this.items = this.items.concat([item]);
    this.itemsChange.emit(this.items);
    this.newItem.setValue("");
  }
  deleteItem(index: number) {
    this.items.splice(index, 1);
    this.items = Object.assign([], this.items);
    this.itemsChange.emit(this.items);
  }

}
