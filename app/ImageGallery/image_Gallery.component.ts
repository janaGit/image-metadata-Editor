import {Component, OnInit} from 'angular2/core';
import {ImageService}     from './../services/image.service';

@Component({
    templateUrl: 'app/ImageGallery/image_Gallery.component.html',
    styleUrls: ['app/ImageGallery/image_Gallery.component.css'],
})
export class ImageGallery implements OnInit {
    private _errorMessage_imageService: string;
    public imageNames_edited: string[];
    public imgDir_edited: string;
    constructor(private _imageService: ImageService) { }
    ngOnInit() {
        this._imageService.getImageNames_edited().subscribe(
            images =>{ this.imageNames_edited = images},
            error =>this._errorMessage_imageService = <any>error
            );
        this.imgDir_edited = this._imageService.imageDir_edited;
    }

}

