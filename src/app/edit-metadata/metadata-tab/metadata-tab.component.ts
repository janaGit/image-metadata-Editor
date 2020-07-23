import {Component} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'metadata-tab',
    templateUrl: 'metadata-tab.component.html',
    styleUrls: ['metadata-tab.component.css', '../../css/global-app.css']
})

export class MetadataTabComponent{
    name = new FormControl('');
}