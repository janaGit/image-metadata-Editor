import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EditorService } from 'app/services/editor.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { MetadataFromMetadataTab } from 'app/types/metadata-from-metadata-tab.interface';

@Component({
    selector: 'metadata-tab',
    templateUrl: 'metadata-tab.component.html',
    styleUrls: ['metadata-tab.component.scss', '../../css/global-app.scss']
})

export class MetadataTabComponent implements OnInit {

    creator = new FormControl('');
    contactInfo = new FormControl('');
    license = new FormControl('');
    subject = new FormControl('');
    description = new FormControl('');

    isCreatorDisabled = false;
    isContactInfoDisabled = false;
    isLicenseDisabled = false;
    isSubjectDisabled = false;
    isDescriptionDisabled = false;

    licenseNames: string[] = [];

    metadataFromImage: MetadataFromMetadataTab;

    constructor(private _editorService: EditorService, private _metadataFromImageService: MetadataFromImageService) {

    }

    ngOnInit(): void {
        this._editorService.license_names$.subscribe(licenseNames => {
            this.licenseNames = licenseNames;
        });
        this._metadataFromImageService.editMetadata$.subscribe(metadataFromImage => {
            this.metadataFromImage = metadataFromImage;
        });
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