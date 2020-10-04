import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { areArraysEqual } from '../../../utilities/utilitiy-methods';

@Component({
  selector: 'app-edit-all-metadata-input-template-buttons',
  templateUrl: './edit-all-metadata-input-template-buttons.component.html',
  styleUrls: ['./edit-all-metadata-input-template-buttons.component.scss']
})
export class EditAllMetdataInputTemplateButtonsComponent implements OnInit {
  @Input() buttonTitleTemplateMetadata: string = "";

  private _templateData: string | string[];
  @Input()
  set templateData(templateData) {
    if (templateData) {
      this._templateData = templateData;
    }

  }
  get templateData() {
    return this._templateData;
  }


  @Output() onClickTemplateButton = new EventEmitter<boolean>();

  @Input() isTemplateDataWithFormDataEqual: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

}
