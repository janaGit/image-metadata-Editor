import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EditAllMetadataService } from '../edit-all-metadata.service';
import { ExistingMetadataTemplateMethods } from '../../types/existing-metadata-templete-methods.type'
import { TemplateExistingMetadata } from '../../types/template-existing-metadata.interface'

@Component({
  selector: 'app-all-metadata-further-metadata-tab.',
  templateUrl: './all-metadata-further-metadata-tab.component.html',
  styleUrls: ['./all-metadata-further-metadata-tab.component.scss', '../../css/global-app.scss']
})
export class AllMetadataFurtherMetadataTabComponent implements OnInit, OnDestroy {

  selectedValue: ExistingMetadataTemplateMethods = null;
  methods = ExistingMetadataTemplateMethods;

  private _metadataKeys: string[] = [];
  set metadataKeys(metadataKeys: string[]) {
    this._metadataKeys = metadataKeys;
    this.sendMetadataToService();
  }
  get metadataKeys() {
    return this._metadataKeys;
  }


  isMetadataKeysShown: boolean = false;


  constructor(private _editAllMetadataService: EditAllMetadataService) { }

  ngOnInit(): void {
    this.selectedValue = this._editAllMetadataService.existingMetadata.method;
    if (this._editAllMetadataService.existingMetadata["keys"]) {
      this.metadataKeys = (<TemplateExistingMetadata>this._editAllMetadataService.existingMetadata).keys;
      this.isMetadataKeysShown = true;
    }
  }

  ngOnDestroy(): void {

  }

  onChangeSelectedItem(event) {
    if (event === ExistingMetadataTemplateMethods.COPY_CUSTOM || event === ExistingMetadataTemplateMethods.DELETE_CUSTOM) {
      this.isMetadataKeysShown = true;
    } else {
      this.isMetadataKeysShown = false;
    }
    this.sendMetadataToService();
  }

  sendMetadataToService() {
      this._editAllMetadataService.updateExistingMetadata({
        keys: this.metadataKeys,
        method: this.selectedValue
      });
  }
}
