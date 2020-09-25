import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EditorService } from 'app/services/editor.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { MetadataFromMetadataTab } from 'app/types/metadata-from-metadata-tab.interface';
import { MetadataService } from '../metadata.service';
import { Subscription } from 'rxjs';
import { MetadataFromTemplateService } from '../metadata-from-template.service';
import { MetadataFromMetadataTemplateTab } from 'app/types/metadata-from-metadata-template-tab.interface';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';

@Component({
    selector: 'metadata-tab',
    templateUrl: 'metadata-tab.component.html',
    styleUrls: ['metadata-tab.component.scss', '../../css/global-app.scss']
})

export class MetadataTabComponent implements OnInit, OnDestroy {

    creator = new FormControl('');
    contactInfo = new FormControl('');
    license = new FormControl('');
    subject = new FormControl('');
    description = new FormControl('');
    keywords: string[] = [];

    isCreatorDisabled = false;
    isContactInfoDisabled = false;
    isLicenseDisabled = false;
    isSubjectDisabled = false;
    isDescriptionDisabled = false;

    licenseNames: string[] = [];


    metadataFromImage: MetadataFromMetadataTab;
    metadataFromTemplate: MetadataFromMetadataTemplateTab;

    constructor(private _cdr: ChangeDetectorRef,
        private _editorService: EditorService,
        private _metadataFromImageService: MetadataFromImageService,
        private _metadataFromTemplateService: MetadataFromTemplateService,
        private _metadataService: MetadataService) {

    }

    ngOnDestroy(): void {
        this._metadataService.updateEditMetadata({
            creator: this.creator.value,
            contactInfo: this.contactInfo.value,
            license: this.license.value,
            keywords: this.keywords,
            subject: this.subject.value,
            description: this.description.value
        });

    }

    ngOnInit(): void {
        this.licenseNames = this._editorService.getLicenseNames;

        this.metadataFromImage = this._metadataFromImageService.editMetadata;

        const editMetadata = this._metadataService.editMetadata;

        this.creator.setValue(editMetadata.creator);
        this.contactInfo.setValue(editMetadata.contactInfo);
        this.license.setValue(editMetadata.license);
        this.subject.setValue(editMetadata.subject);
        this.description.setValue(editMetadata.description);
        this.keywords = editMetadata.keywords;

        if (this._metadataFromTemplateService.editMetadata) {
            this.metadataFromTemplate = deepCopyFunction(this._metadataFromTemplateService.editMetadata);
        }
    }

    onChangeCreator(value) {

    }
    onChangeContactInfo(value) {


    }
    onChangeLicense(value) {


    }
    onChangeSubject(value) {


    }
    onChangeDescription(value) {


    }

    getCreatorFromImage() {
        this.creator.setValue(deepCopyFunction(this.metadataFromImage.creator));
    }
    getCreatorFromTemplate() {
        this.creator.setValue(deepCopyFunction(this.metadataFromTemplate.creator));
    }

    getContactInfoFromImage() {
        this.contactInfo.setValue(deepCopyFunction(this.metadataFromImage.contactInfo));
    }
    getContactInfoFromTemplate() {
        this.contactInfo.setValue(deepCopyFunction(this.metadataFromTemplate.contactInfo));
    }

    getSubjectFromImage() {
        this.subject.setValue(deepCopyFunction(this.metadataFromImage.subject));
    }
    getSubjectFromTemplate() {
        this.subject.setValue(deepCopyFunction(this.metadataFromTemplate.subject));
    }

    getDescriptionFromImage() {
        this.description.setValue(deepCopyFunction(this.metadataFromImage.description));
    }
    getDescriptionFromTemplate() {
        this.description.setValue(deepCopyFunction(this.metadataFromTemplate.description));
    }
    getKeywordsFromImage() {
        this.keywords = deepCopyFunction(this.metadataFromImage.keywords);
    }
    getKeywordsFromTemplate() {
        this.keywords = deepCopyFunction(this.metadataFromTemplate.keywords);
    }
    getLicenseFromImage() {
        this.license.setValue(deepCopyFunction(this.metadataFromImage.license));
    }
    getLicenseFromTemplate() {
        this.license.setValue(deepCopyFunction(this.metadataFromTemplate.license));
    }
}