import {Component} from 'angular2/core';
import { HTTP_PROVIDERS }    from 'angular2/http';


import {ImageService}     from './services/image.service';
import {ExifToolService}  from './services/exifTool.service';
import {Edit_MetadataService} from './services/edit_Metadata.service';
import {EditMetadataComponent} from './EditMetadata/editMetadata.component';
@Component({
    selector: 'my-app',
    providers: [ HTTP_PROVIDERS, ImageService, ExifToolService, Edit_MetadataService],
    directives: [EditMetadataComponent],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
})



export class AppComponent{
    
}
