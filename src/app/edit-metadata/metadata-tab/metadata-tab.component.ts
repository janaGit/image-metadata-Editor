import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EditorService } from 'app/services/editor.service';
import { MetadataFromImageService } from 'app/edit-metadata/metadata-from-image.service';
import { MetadataFromMetadataTab } from 'app/types/metadata-from-metadata-tab.interface';
import { MetadataService } from '../metadata.service';
import { Subscription } from 'rxjs';

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

    constructor(private _cdr: ChangeDetectorRef, private _editorService: EditorService, private _metadataFromImageService: MetadataFromImageService, private _metadataService: MetadataService) {

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

        this.metadataFromImage  = this._metadataFromImageService.editMetadata;

        const editMetadata = this._metadataService.editMetadata;

        this.creator.setValue(editMetadata?.creator);
        this.contactInfo.setValue(editMetadata?.contactInfo);
        this.license.setValue(editMetadata?.license);
        this.subject.setValue(editMetadata?.subject);
        this.description.setValue(editMetadata?.description);
        this.keywords = editMetadata?.keywords;


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
        this.creator.setValue(this.metadataFromImage.creator);
    }
    getCreatorFromTemplate() {

    }

    getContactInfoFromImage() {
        this.contactInfo.setValue(this.metadataFromImage.contactInfo);
    }
    getContactInfoFromTemplate() {

    }

    getSubjectFromImage() {
        this.subject.setValue(this.metadataFromImage.subject);
    }
    getSubjectFromTemplate() {

    }

    getDescriptionFromImage() {
        this.description.setValue(this.metadataFromImage.description);
    }
    getDescriptionFromTemplate() {

    }
}