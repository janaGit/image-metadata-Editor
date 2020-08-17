import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EditTemplateService } from '../edit-template.service';
import { ExistingMetadataTemplateMethods } from '../../types/existing-metadata-templete-methods.type'
import { TemplateMetadataKeys } from '../../types/template-metadata-keys.interface'

@Component({
  selector: 'app-existing-metadata-template-tab',
  templateUrl: './existing-metadata-template-tab.component.html',
  styleUrls: ['./existing-metadata-template-tab.component.scss', '../../css/global-app.scss']
})
export class ExistingMetadataTemplateTabComponent implements OnInit, OnDestroy {

  selectedValue: ExistingMetadataTemplateMethods = null;
  methods = ExistingMetadataTemplateMethods;
  metadataKeys: string[] = [];
  isMetadataKeysShown: boolean = false;


  constructor(private _editTemplateService: EditTemplateService) { }

  ngOnInit(): void {
    this.selectedValue = this._editTemplateService.existingMetadata.method;
    if (this._editTemplateService.existingMetadata["keys"]) {
      this.metadataKeys = (<TemplateMetadataKeys>this._editTemplateService.existingMetadata).keys;
      this.isMetadataKeysShown= true;
    }
  }

  ngOnDestroy(): void {
    if (this.selectedValue === ExistingMetadataTemplateMethods.COPY_CUSTOM || this.selectedValue === ExistingMetadataTemplateMethods.DELETE_CUSTOM) {
      this._editTemplateService.updateExistingMetadata({
        keys: this.metadataKeys,
        method: this.selectedValue
      });
    } else {
      this._editTemplateService.updateExistingMetadata({
        method: this.selectedValue
      });
    }


  }
  onChangeSelectedItem(event) {
    if (event === ExistingMetadataTemplateMethods.COPY_CUSTOM || event === ExistingMetadataTemplateMethods.DELETE_CUSTOM) {
      this.isMetadataKeysShown = true;
    } else {
      this.isMetadataKeysShown = false;
    }
  }
}
