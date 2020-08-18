import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MetadataFromMetadataTab } from 'app/types/metadata-from-metadata-tab.interface';
import { EditorService } from 'app/services/editor.service';
import { MetadataFromImageService } from 'app/edit-metadata/metadata-from-image.service';
import { MetadataService } from 'app/edit-metadata/metadata.service';
import { EditTemplateService } from '../edit-template.service';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';

@Component({
  selector: 'app-edit-metadata-template-tab',
  templateUrl: './edit-metadata-template-tab.component.html',
  styleUrls: ['./edit-metadata-template-tab.component.scss', '../../css/global-app.scss']
})
export class EditMetadataTemplateTabComponent implements OnInit {

  creator = new FormControl('');
  contactInfo = new FormControl('');
  license = new FormControl('');
  subject = new FormControl('');
  description = new FormControl('');
  keywords: string[] = [];

  isCreatorCopiedFromImage = false;
  isContactInfoCopiedFromImage = false;
  isLicenseCopiedFromImage = false;
  areKeywordsCopiedFromImage = false;
  isSubjectCopiedFromImage = false;
  isDescriptionCopiedFromImage = false;

  licenseNames: string[] = [];


  metadataFromImage: MetadataFromMetadataTab;

  constructor(private _cdr: ChangeDetectorRef, private _editorService: EditorService, private _editTemplateService: EditTemplateService) {

  }

  ngOnDestroy(): void {
    this._editTemplateService.updateEditMetadata({
      creator: this.creator.value,
      isCreatorCopiedFromImage: this.isCreatorCopiedFromImage,
      contactInfo: this.contactInfo.value,
      isContactInfoCopiedFromImage: this.isContactInfoCopiedFromImage,
      license: this.license.value,
      isLicenseCopiedFromImage: this.isLicenseCopiedFromImage,
      keywords: this.keywords,
      areKeywordsCopiedFromImage: this.areKeywordsCopiedFromImage,
      subject: this.subject.value,
      isSubjectCopiedFromImage: this.isSubjectCopiedFromImage,
      description: this.description.value,
      isDescriptionCopiedFromImage: this.isDescriptionCopiedFromImage
    });

  }

  ngOnInit(): void {
    this.licenseNames = this._editorService.getLicenseNames;

    const editMetadata = deepCopyFunction(this._editTemplateService.editMetadata);

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


  }


}
