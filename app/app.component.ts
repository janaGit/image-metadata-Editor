import {Component, OnInit} from 'angular2/core';
import { HTTP_PROVIDERS }    from 'angular2/http';

import {ImageService}     from './services/image.service';
import {ExifToolService}  from './services/exifTool.service';
import {Edit_MetadataService} from './EditMetadata/services/edit_Metadata.service';
import {EditMetadataComponent} from './EditMetadata/editMetadata.component';
import {ImageGallery} from './ImageGallery/image_Gallery.component';

import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from 'angular2/router';
var imageDir = 'images';

@Component({
    selector: 'my-app',
    providers: [HTTP_PROVIDERS, ImageService, ExifToolService, Edit_MetadataService, ROUTER_PROVIDERS],
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
})
@RouteConfig([
    {
        path: '/edit_metadata',
        name: 'EditMetadata',
        component: EditMetadataComponent,
        useAsDefault: true
    },
    {
        path: '/image_gallery',
        name: 'ImageGallery',
        component: ImageGallery,
    }
])


export class AppComponent implements OnInit {
    private changeView_Text = 'show Image Gallery';
    constructor(private _imageService: ImageService, private _router: Router) {

    }
    ngOnInit() {
        this._imageService.imageDir = imageDir;
    }
    changeView() {
        if (this.changeView_Text === 'show Image Gallery') {
            this.changeView_Text = 'edit Metadata';
            this._router.navigate(['ImageGallery']);
        } else {
            this.changeView_Text = 'show Image Gallery';
            this._router.navigate(['EditMetadata']);
        }


    }
}
