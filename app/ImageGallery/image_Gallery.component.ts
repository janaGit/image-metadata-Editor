import {Component, OnInit, Renderer} from 'angular2/core';
import {Subject} from 'rxjs/Rx';
import {ImageService}     from './../services/image.service';
import {OnMouseOverImageDirective}     from './../directives/onMouseOverImage.directive';
import {ExifToolService}  from './../services/exifTool.service';
import {ContextMenuHolderComponent} from './../modals/contextMenuHolder.component';

@Component({
    templateUrl: 'app/ImageGallery/image_Gallery.component.html',
    styleUrls: ['app/ImageGallery/image_Gallery.component.css'],
    directives: [OnMouseOverImageDirective, ContextMenuHolderComponent]
})
export class ImageGallery implements OnInit {
    private _errorMessage_imageService: string;
    errorMessage_exifToolService: string;
    private _imageNameClicked: string;
    public imageNames_edited: string[];
    public imgDir_edited: string;
    metadata = {};
    metadata_keys = [];
    private _editedImages_text="images_edited.txt";
    private _contextMenuElements = [
        { title: 'transfer for editing', subject: new Subject() },
        { title: 'help', subject: new Subject() }
    ];
    constructor(private _imageService: ImageService, private _exifToolService: ExifToolService, private _renderer: Renderer) { }
    ngOnInit() {
        this._imageService.getImageNames_edited().subscribe(
            images => {
                images = this.removeString(images, this._editedImages_text); this.imageNames_edited = images
            },
            error => this._errorMessage_imageService = <any>error
        );
        this.imgDir_edited = this._imageService.imageDir_edited;
        this._contextMenuElements.forEach(elements => elements.subject.subscribe(val => this.contextMenu(val)));
    }
    onMouseOverImage(event) {
        if (event.event === 'mouseOver') {
            if (typeof this._imageNameClicked === 'undefined') {
                this.getMetadata(event.img_name);
            }
        }
        if (event.event === 'mouseClicked') {
            if (this._imageNameClicked !== event.img_name) {
                this.getMetadata(event.img_name);
                this._imageNameClicked = event.img_name;
                this._renderer.setElementClass(event.element, 'clicked', true);
            } else {
                this._imageNameClicked = undefined;
                this._renderer.setElementClass(event.element, 'clicked', false);
            }
        }
    }
    getMetadata(imageName: string) {
        this._exifToolService.getMetadata_edited(imageName).subscribe(
            data => { this.metadata = data; this.metadata_keys = Object.keys(data); },
            error => this.errorMessage_exifToolService = <any>error
        );
    }
    imageClicked(imgName: string) {
        if (this._imageNameClicked === imgName) {
            return true;
        }
        return false;
    }
    contextMenu(val) {
        alert(val)
    }
    removeString(array: string[], string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].indexOf(string)>-1) {
                array.splice(i, 1);

            }
        }
        return array;
    }
}

