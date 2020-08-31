import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { areArraysEqual } from '../../../utilities/utilitiy-methods';

@Component({
  selector: 'app-input-template-buttons',
  templateUrl: './input-template-buttons.component.html',
  styleUrls: ['./input-template-buttons.component.scss']
})
export class InputTemplateButtonsComponent implements OnInit {

  @Input() templateData: string | string[] | undefined;
  @Input() imageData: string | string[] | undefined;
@Input()
set formData(data: string | string[] | undefined) {
  if (Array.isArray(data)) {
    if (areArraysEqual(data, this.templateData) && data !== []) {
      this.isTemplateDataWithFormDataEqual = true;
    } else {
      this.isTemplateDataWithFormDataEqual = false;
    }

    if (areArraysEqual(data, this.imageData) && data !== []) {
      this.isImageDataWithFormDataEqual = true;
    } else {
      this.isImageDataWithFormDataEqual = false;
    }
  } else {
    if (data === this.templateData && data !== "") {
      this.isTemplateDataWithFormDataEqual = true;
    } else {
      this.isTemplateDataWithFormDataEqual = false;
    }

    if (data === this.imageData && data !== "") {
      this.isImageDataWithFormDataEqual = true;
    } else {
      this.isImageDataWithFormDataEqual = false;
    }
  }

}
@Output() onClickTemplateButton = new EventEmitter<boolean>();
@Output() onClickImageButton = new EventEmitter<boolean>();

isTemplateDataWithFormDataEqual: boolean = false;
isImageDataWithFormDataEqual: boolean = false;
constructor() { }

ngOnInit(): void {
}

}
