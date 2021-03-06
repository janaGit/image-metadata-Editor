import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MetadataService } from '../metadata.service';
import { Router } from '@angular/router';
import { ImageService } from 'app/services/image.service';
import { EditorService } from 'app/services/editor.service';


@Component({
    selector: 'complete-tab',
    templateUrl: 'complete-tab.component.html',
    styleUrls: ['complete-tab.component.scss', '../../css/global-app.scss']
})
export class CompleteComponent implements OnInit, OnDestroy {
    metadata: Object = {};
    metadataKeys: string[] = [];


    constructor(private _cdr: ChangeDetectorRef,
        private _metadataService: MetadataService,
        private _editorService: EditorService,
        private _router: Router,
        private _imageService: ImageService) {

    }


    ngOnDestroy(): void {

    }
    ngOnInit() {
        this.metadata = this._metadataService.getAllMetadata();
        this.metadataKeys = Object.keys(this.metadata).sort(this.shiftEditableKeysUp.bind(this));
    }

    async onClickSave() {
        await this._metadataService.sendMetadataToBackend();
        this._imageService.moveImageToImageGalleryAndUpdateImagesInFolder_Edited(this._editorService.imageName);

        this._router.navigate(["image_gallery"]);
    }

    isEditableKey(key: string) {
        return this._editorService.isEditableKey(key);
    }

    isImportantMetadataKey(key: string) {
        return this._editorService.isImportantMetadataKey(key);
    }

    isEditableOrImportantKey(key: string) {
        return this.isEditableKey(key) || this.isImportantMetadataKey(key);
    }
    shiftEditableKeysUp(this, a, b) {
        if (!this.isEditableOrImportantKey(a) && this.isEditableOrImportantKey(b)) {
            return 1;
        }
        if (this.isEditableOrImportantKey(a) && !this.isEditableOrImportantKey(b)) {
            return -1;
        }
        if ([a, b].sort()[0] === a) {
            return -1;
        } else {
            return 1;
        }

    };
}