import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EditorService } from 'app/services/editor.service';

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

    constructor(private _editorService: EditorService) {

    }

    ngOnInit(): void {
        this._editorService.license_names$.subscribe(licenseNames => {
            this.licenseNames = licenseNames;
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
}