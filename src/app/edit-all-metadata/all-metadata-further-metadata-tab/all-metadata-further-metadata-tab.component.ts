import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EditAllMetadataService } from '../edit-all-metadata.service';
import { ExistingMetadataTemplateMethods } from '../../types/existing-metadata-templete-methods.type'
import { TemplateExistingMetadata } from '../../types/template-existing-metadata.interface'
import { EditAllMetadataFromTemplateService } from '../edit-all-metadata-from-template.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-all-metadata-further-metadata-tab',
  templateUrl: './all-metadata-further-metadata-tab.component.html',
  styleUrls: ['./all-metadata-further-metadata-tab.component.scss', '../../css/global-app.scss']
})
export class AllMetadataFurtherMetadataTabComponent implements OnInit, OnDestroy {

  selectedValue: ExistingMetadataTemplateMethods = null;
  methods = ExistingMetadataTemplateMethods;

  selectedValueFromTemplate: ExistingMetadataTemplateMethods = null;


  private _metadataKeys: string[] = [];
  set metadataKeys(metadataKeys: string[]) {
    this._metadataKeys = metadataKeys;
    this.sendMetadataToService();
  }
  get metadataKeys() {
    return this._metadataKeys;
  }

  private _metadataKeysFromTemplate: string[] = [];
  set metadataKeysFromTemplate(metadataKeys: string[]) {
    this._metadataKeysFromTemplate = metadataKeys;
    this.sendMetadataToService();
  }
  get metadataKeysFromTemplate() {
    return this._metadataKeysFromTemplate;
  }

  templateSubscription: Subscription;
  isMetadataKeysShown: boolean = false;


  constructor(private _editAllMetadataService: EditAllMetadataService,
    private _editAllMetadataFromTemplateService: EditAllMetadataFromTemplateService) { }

  ngOnInit(): void {
    this.selectedValue = this._editAllMetadataService.existingMetadata.method;
    if (this._editAllMetadataService.existingMetadata["keys"]) {
      this.metadataKeys = (<TemplateExistingMetadata>this._editAllMetadataService.existingMetadata).keys;
      this.isMetadataKeysShown = true;
    }
    this.templateSubscription = this._editAllMetadataFromTemplateService.existingMetadata$.subscribe(metadataFromTemplate => {
      this.metadataKeysFromTemplate = metadataFromTemplate.keys;
      this.selectedValueFromTemplate = metadataFromTemplate.method;
    });
  }

  ngOnDestroy(): void {
    this.sendMetadataToService();
  }

  onChangeSelectedItem(event) {
    if (event === ExistingMetadataTemplateMethods.COPY_CUSTOM || event === ExistingMetadataTemplateMethods.DELETE_CUSTOM) {
      this.isMetadataKeysShown = true;
    } else {
      this.isMetadataKeysShown = false;
    }
  }

  sendMetadataToService() {
    this._editAllMetadataService.updateExistingMetadata({
      keys: this.metadataKeys,
      method: this.selectedValue
    });
  }

  setSelectedItemFromTemplate() {
    this.selectedValue = this.selectedValueFromTemplate;
    this.onChangeSelectedItem(this.selectedValue);
  }

  setMetadataKeysFromTemplate() {
    this.metadataKeys = this.metadataKeysFromTemplate;
  }
}
