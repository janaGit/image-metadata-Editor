import {Component, OnInit,Output,EventEmitter} from 'angular2/core';
import {ImageService}     from './../../services/image.service';
import {Edit_MetadataService} from './../../services/edit_Metadata.service';
import {GetDropedImageDirective} from './../../directives/getDropedImage.directive';
import {ShowMetadataComponent} from './../../modals/showMetadata.component';

var imageDir = 'images';

@Component({
    selector: 'FileTab',
    templateUrl: 'app/EditMetadata/FileTab/file.component.html',
    directives: [GetDropedImageDirective,ShowMetadataComponent],
    styleUrls: ['app/EditMetadata/FileTab/file.component.css']
})

export class FileComponent implements OnInit {
    imageNames: string[];
    errorMessage_imageService: string;
    imgNumber = 0;
    imageName: string;
    imgPath: string;
    @Output() start=new EventEmitter<boolean>();

    constructor(private _imageService: ImageService, private _edit_MetadataService:Edit_MetadataService) { }

    ngOnInit() { this.refresh(); }


    getDropedImage(file: File) {
        var self = this;
        this._imageService.sendImage(file).then(fileName => {

            self.refreshImageList().then(function() {
                var index = self.getImageNumber(fileName);

                if (index != -1) {
                    self.imgNumber = index;
                }
                self.loadImage(false);
            })


        });


    }
    refresh() {
        var self = this;
        this.refreshImageList().then(function() { self.loadImage(true) });
    }
    refreshImageList() {
        var self = this;

        return new Promise(function(resolve) {
            self._imageService.getImageNames()
                .subscribe(
                images => self.imageNames = images,
                error => self.errorMessage_imageService = <any>error,
                () => resolve()
                );
        });


    }
    getImageNumber(name) {
        var index = this.imageNames.findIndex(
            function(element) {
                if (name == element) {
                    return true;
                }
                return false;
            }
        );
        if (index == -1) {
            console.info('index==-1; ImageName not found in list!')
        }
        return index;
    }
    nextImage() {
        this.imgNumber = this.imgNumber + 1;
        this.loadImage(false);
    }
    previousImage() {
        this.imgNumber = this.imgNumber - 1;
        this.loadImage(false);
    }
    loadImage(start) {
        if (start == true) {
            this.imgNumber = 0;
        }
        if (this.imgNumber == this.imageNames.length) {
            this.imgNumber = 0;
        }
        else {
            if (this.imgNumber < 0) {
                this.imgNumber = this.imageNames.length - 1;
            }
        }
        this.imageName = this.imageNames[this.imgNumber];
        this.imgPath = imageDir + '/' + this.imageName;
    }
    deleteImage() {
        var self = this;
        this._imageService.deleteImage(this.imageName).subscribe(
            error => this.errorMessage_imageService = <any>error,
            () => this.refreshImageList().then(function() { self.loadImage(false); })
        );
    }
    startEditing(){
        this._edit_MetadataService.imageName=this.imageName;
        this.start.emit(true);
    }

}