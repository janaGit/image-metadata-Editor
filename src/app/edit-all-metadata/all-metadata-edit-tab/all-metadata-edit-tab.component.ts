import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MetadataFromMetadataTab } from 'app/types/metadata-from-metadata-tab.interface';
import { EditorService } from 'app/services/editor.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { MetadataService } from 'app/edit-metadata/metadata.service';
import { EditAllMetadataService } from '../edit-all-metadata.service';
import { areArraysEqual, deepCopyFunction } from '../../../../utilities/utilitiy-methods';
import { EditAllMetadataFromTemplateService } from '../edit-all-metadata-from-template.service';
import { MetadataFromMetadataTemplateTab } from 'app/types/metadata-from-metadata-template-tab.interface';

@Component({
  selector: 'app-all-metadata-edit-tab',
  templateUrl: './all-metadata-edit-tab.component.html',
  styleUrls: ['./all-metadata-edit-tab.component.scss', '../../css/global-app.scss']
})
export class AllMetadataEditTabComponent implements OnInit {

  creator = new FormControl('');


  contactInfo = new FormControl('');


  license = new FormControl('');


  subject = new FormControl('');


  description = new FormControl('');


  private _keywords: string[] = [];
  set keywords(keywords: string[]) {
    this._keywords = keywords;
  }
  get keywords() {
    return this._keywords;
  }


  private _isCreatorCopiedFromImage: boolean = false;
  set isCreatorCopiedFromImage(isCreatorCopiedFromImage: boolean) {
    this._isCreatorCopiedFromImage = isCreatorCopiedFromImage;
  }
  get isCreatorCopiedFromImage() {
    return this._isCreatorCopiedFromImage;
  }


  private _isContactInfoCopiedFromImage: boolean = false;
  set isContactInfoCopiedFromImage(isContactInfoCopiedFromImage: boolean) {
    this._isContactInfoCopiedFromImage = isContactInfoCopiedFromImage;
  }
  get isContactInfoCopiedFromImage() {
    return this._isContactInfoCopiedFromImage;
  }


  private _isLicenseCopiedFromImage: boolean = false;
  set isLicenseCopiedFromImage(isLicenseCopiedFromImage: boolean) {
    this._isLicenseCopiedFromImage = isLicenseCopiedFromImage;
  }
  get isLicenseCopiedFromImage() {
    return this._isLicenseCopiedFromImage;
  }


  private _areKeywordsCopiedFromImage: boolean = false;
  set areKeywordsCopiedFromImage(areKeywordsCopiedFromImage: boolean) {
    this._areKeywordsCopiedFromImage = areKeywordsCopiedFromImage;
  }
  get areKeywordsCopiedFromImage() {
    return this._areKeywordsCopiedFromImage;
  }

  private _areKeywordsToDeleteFromImage: boolean = false;
  set areKeywordsToDeleteFromImage(areKeywordsToDeleteFromImage: boolean) {
    this._areKeywordsToDeleteFromImage = areKeywordsToDeleteFromImage;
  }
  get areKeywordsToDeleteFromImage() {
    return this._areKeywordsToDeleteFromImage;
  }


  private _isSubjectCopiedFromImage: boolean = false;
  set isSubjectCopiedFromImage(isSubjectCopiedFromImage: boolean) {
    this._isSubjectCopiedFromImage = isSubjectCopiedFromImage;
  }
  get isSubjectCopiedFromImage() {
    return this._isSubjectCopiedFromImage;
  }


  private _isDescriptionCopiedFromImage: boolean = false;
  set isDescriptionCopiedFromImage(isDescriptionCopiedFromImage: boolean) {
    this._isDescriptionCopiedFromImage = isDescriptionCopiedFromImage;
  }
  get isDescriptionCopiedFromImage() {
    return this._isDescriptionCopiedFromImage;
  }

  areArraysEqual = areArraysEqual;
  licenseNames: string[] = [];

  templateData: MetadataFromMetadataTemplateTab;


  constructor(private _cdr: ChangeDetectorRef,
    private _editorService: EditorService,
    private _editAllMetadataService: EditAllMetadataService,
    private _editAllMetadataFromTemplateService: EditAllMetadataFromTemplateService) {

  }

  ngOnDestroy(): void {
    this.sendMetadataToService();
  }




  ngOnInit(): void {
    this.licenseNames = this._editorService.getLicenseNames;

    const editMetadata = deepCopyFunction(this._editAllMetadataService.editMetadata);

    this.creator.setValue(editMetadata.creator);
    this.isCreatorCopiedFromImage = editMetadata.isCreatorCopiedFromImage;
    this.contactInfo.setValue(editMetadata.contactInfo);
    this.isContactInfoCopiedFromImage = editMetadata.isContactInfoCopiedFromImage;
    this.license.setValue(editMetadata.license);
    this.isLicenseCopiedFromImage = editMetadata.isLicenseCopiedFromImage;
    this.subject.setValue(editMetadata.subject);
    this.isSubjectCopiedFromImage = editMetadata.isSubjectCopiedFromImage;
    this.description.setValue(editMetadata.description);
    this.isDescriptionCopiedFromImage = editMetadata.isDescriptionCopiedFromImage;
    this.keywords = editMetadata.keywords;
    this.areKeywordsCopiedFromImage = editMetadata.areKeywordsCopiedFromImage;
    this.areKeywordsToDeleteFromImage = editMetadata.areKeywordsToDeleteFromImage;

    this.templateData = this._editAllMetadataFromTemplateService.editMetadata;
  }

  sendMetadataToService() {
    this._editAllMetadataService.updateEditMetadata({
      creator: this.creator.value,
      isCreatorCopiedFromImage: this.isCreatorCopiedFromImage,
      contactInfo: this.contactInfo.value,
      isContactInfoCopiedFromImage: this.isContactInfoCopiedFromImage,
      license: this.license.value,
      isLicenseCopiedFromImage: this.isLicenseCopiedFromImage,
      keywords: this.keywords,
      areKeywordsCopiedFromImage: this.areKeywordsCopiedFromImage,
      areKeywordsToDeleteFromImage: this.areKeywordsToDeleteFromImage,
      subject: this.subject.value,
      isSubjectCopiedFromImage: this.isSubjectCopiedFromImage,
      description: this.description.value,
      isDescriptionCopiedFromImage: this.isDescriptionCopiedFromImage
    });
  }

  setCreatorFromTemplate() {
    this.creator.setValue(this.templateData.creator);
    this.isCreatorCopiedFromImage = this.templateData.isCreatorCopiedFromImage;
  }
  setContactInfoFromTemplate() {
    this.contactInfo.setValue(this.templateData.contactInfo);
    this.isContactInfoCopiedFromImage = this.templateData.isContactInfoCopiedFromImage;
  }
  setLicenseFromTemplate() {
    this.license.setValue(this.templateData.license);
    this.isLicenseCopiedFromImage = this.templateData.isLicenseCopiedFromImage;
  }
  setKeywordsFromTemplate() {
    this.keywords = deepCopyFunction(this.templateData.keywords);
    this.areKeywordsCopiedFromImage = this.templateData.areKeywordsCopiedFromImage;
    this.areKeywordsToDeleteFromImage = this.templateData.areKeywordsToDeleteFromImage;
  }
  setSubjectFromTemplate() {
    this.subject.setValue(this.templateData.subject);
    this.isSubjectCopiedFromImage = this.templateData.isSubjectCopiedFromImage;
  }
  setDescriptionFromTemplate() {
    this.description.setValue(this.templateData.description);
    this.isDescriptionCopiedFromImage = this.templateData.isDescriptionCopiedFromImage;
  }

  onChangeAreKeywordsToDeleteFromImage(event) {
    if (event === true) {
      this.areKeywordsToDeleteFromImage = true;
    } else {
      this.areKeywordsToDeleteFromImage = false;
    }
  }
}
