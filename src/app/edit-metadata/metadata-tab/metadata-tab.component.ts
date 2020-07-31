import {Component} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'metadata-tab',
    templateUrl: 'metadata-tab.component.html',
    styleUrls: ['metadata-tab.component.css', '../../css/global-app.css']
})

export class MetadataTabComponent{
    creator = new FormControl('');
    contactInfo = new FormControl('');
    license = new FormControl('');
    subject = new FormControl('');
    description = new FormControl('');

    isCreatorDisabled= false;
    isContactInfoDisabled= false;
    isLicenseDisabled= false;
    isSubjectDisabled= false;
    isDescriptionDisabled= false;

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