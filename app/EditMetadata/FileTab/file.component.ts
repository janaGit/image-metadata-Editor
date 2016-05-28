import {Component, OnInit, Output, EventEmitter} from 'angular2/core';
import {Subject} from 'rxjs/Rx';
import {ImageService}     from './../../services/image.service';
import {Edit_MetadataService} from './../services/edit_Metadata.service';
import {GetDropedImageDirective} from './../../directives/getDropedImage.directive';
import {ShowMetadataComponent} from './../../modals/showMetadata.component';
import {ExifToolService}  from './../../services/exifTool.service';
import {OnMouseOverImageDirective}     from './../../directives/onMouseOverImage.directive';
import {ContextMenuHolderComponent} from './../../modals/contextMenuHolder.component';

@Component({
    selector: 'FileTab',
    templateUrl: 'app/EditMetadata/FileTab/file.component.html',
    directives: [GetDropedImageDirective, ShowMetadataComponent, OnMouseOverImageDirective, ContextMenuHolderComponent],
    styleUrls: ['app/EditMetadata/FileTab/file.component.css'],
    host: {
        '(window:keyup)': 'onKey($event)'
    }
})

export class FileComponent implements OnInit {
    imageNames: string[];
    errorMessage_imageService: string;
    imgNumber = 0;
    imageName: string;
    imgPath: string;
    imageDir: string;
    _displayMetadataModal = false;
    @Output() start = new EventEmitter<boolean>();
    private _contextMenuElements = [
        { title: 'transfer to image gallery', subject: new Subject() },
        { title: 'help', subject: new Subject() }
    ];
    constructor(private _exifToolService: ExifToolService, private _imageService: ImageService, private _edit_MetadataService: Edit_MetadataService) { }

    ngOnInit() {
        this.imageDir = this._imageService.imageDir;
        this._contextMenuElements.forEach(elements => elements.subject.subscribe(val => this.contextMenu(val)));
        this.refresh();
    }


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
        this.imgPath = this.imageDir + '/' + this.imageName;
    }
    deleteImage() {
        var self = this;
        this._imageService.deleteImage(this.imageName).subscribe(
            error => this.errorMessage_imageService = <any>error,
            () => this.refreshImageList().then(function() { self.loadImage(false); })
        );
    }
    startEditing() {
        var message = this.metadata_has_Error(this.imageName);
        message.then(data => {
            this._edit_MetadataService.setImageName(this.imageName);
            this.start.emit(true);
        }, error => {
            this.errorMessage_imageService = error;
        })
    }
    metadata_has_Error(imageName: string): Promise<String> {
        var self = this;
        return new Promise(function(resolve, reject) {
            self._exifToolService.getMetadata(imageName).subscribe(
                data => {
                    if (typeof data['Error'] === 'undefined') {
                        resolve('true');
                    }
                    reject(data['Error']);
                },
                error => { reject(error); }
            );
        })

    }
    onKey(event) {
        var key = event.key;
        switch (key) {
            case 'a':
                this.previousImage();
                break;
            case 'd':
                this.nextImage();
                break;
            case 'w':
                this.displayMetadataModal();

        }
    }
    displayMetadataModal() {
        this._displayMetadataModal = !this._displayMetadataModal;
    }
    contextMenu(val) {
        if (val === this._contextMenuElements[0].title) {
            this._imageService.moveImageToImageGallery(this.imageName).subscribe(
                data => { this.refresh(); },
                error => this.errorMessage_imageService = <any>error
            );
        }
    }
}