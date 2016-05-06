import {Component, OnInit} from 'angular2/core';
import { HTTP_PROVIDERS }    from 'angular2/http';

import {ImageService}     from './services/image.service';
import {ExifToolService}  from './services/exifTool.service';
import {Edit_MetadataService} from './EditMetadata/services/edit_Metadata.service';
import {EditMetadataComponent} from './EditMetadata/editMetadata.component';
import {ImageGallery} from './ImageGallery/image_Gallery.component';

import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from 'angular2/router';
var imageDir = 'images';
var imageDir_edited = 'images_edited';

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
    private changeView_Text = 'show edited Images';
    private button_text = new Map<string, string>();

    constructor(private _imageService: ImageService, private _router: Router) {

    }
    ngOnInit() {
        this._imageService.imageDir = imageDir;
        this._imageService.imageDir_edited = imageDir_edited;
        this.button_text.set('/edit_metadata', 'edit Metadata');
        this.button_text.set('/image_gallery', 'show edited Images');
    }
    changeView() {

        this.changeView_Text=this.button_text.get(location.pathname)
        if ( location.pathname==='/edit_metadata') {
            this._router.navigate(['ImageGallery']);
        } else {
            this._router.navigate(['EditMetadata']);
        }


    }
}
