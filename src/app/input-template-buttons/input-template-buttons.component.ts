import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { areArraysEqual } from '../../../utilities/utilitiy-methods';

@Component({
  selector: 'app-input-template-buttons',
  templateUrl: './input-template-buttons.component.html',
  styleUrls: ['./input-template-buttons.component.scss']
})
export class InputTemplateButtonsComponent implements OnInit {

  private _templateData: string | string[];
  @Input()
  set templateData(templateData) {
    if (templateData) {
      this._templateData = templateData;
      this.testEquality();
    }

  }
  get templateData() {
    return this._templateData;
  }

  private _imageData: string | string[];
  @Input()
  set imageData(imageData) {
    if (imageData) {
      this._imageData = imageData;
      this.testEquality();
    }

  }
  get imageData() {
    return this._imageData;
  }


  private _formData: string | string[];
  @Input()
  set formData(formData) {
    if (formData) {
      this._formData = formData;
      this.testEquality();
    }

  }
  get formData() {
    return this._formData;
  }



  @Output() onClickTemplateButton = new EventEmitter<boolean>();
  @Output() onClickImageButton = new EventEmitter<boolean>();

  isTemplateDataWithFormDataEqual: boolean = false;
  isImageDataWithFormDataEqual: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  testEquality() {
    if (Array.isArray(this.formData)) {
      if (areArraysEqual(this.formData, this.templateData) && this.formData !== []) {
        this.isTemplateDataWithFormDataEqual = true;
      } else {
        this.isTemplateDataWithFormDataEqual = false;
      }

      if (areArraysEqual(this.formData, this.imageData) && this.formData !== []) {
        this.isImageDataWithFormDataEqual = true;
      } else {
        this.isImageDataWithFormDataEqual = false;
      }
    } else {
      if (this.formData === this.templateData && this.formData !== "") {
        this.isTemplateDataWithFormDataEqual = true;
      } else {
        this.isTemplateDataWithFormDataEqual = false;
      }

      if (this.formData === this.imageData && this.formData !== "") {
        this.isImageDataWithFormDataEqual = true;
      } else {
        this.isImageDataWithFormDataEqual = false;
      }
    }
  }
}
