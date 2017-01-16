import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { TabDirective } from 'ng2-bootstrap/ng2-bootstrap';


import { Edit_MetadataService } from './services/edit_Metadata.service';
import { ImageService } from './../services/image.service';

/**
 *  Main component of the editor view.
*/
@Component({
    selector: 'edit-Metadata',
    templateUrl: 'editMetadata.component.html',
    styleUrls: ['editMetadata.component.css']
})
export class EditMetadataComponent implements OnInit {
    /**
     * Name of the actual selected tab.
     */
    public selectedTabName: string;
    /**
     * Path  to the actual selected image:
     * 
     * imgDir/imgName
     */
    public imgPath: string;
    /**
     * Name of the folder where the images are stored 
     * that should be edited.
     */
    public imgDir: string;
    /**
     * Tabs for the different steps of the editing process.
     */
    public tabs: Array<any> = [
        { title: 'File', tab: 'File' },
        { title: 'Edit Metadata', tab: 'Edit_Metadata', disabled: true },
        { title: 'Additional Metadata', tab: 'Metadata', disabled: true },
        { title: 'Location', tab: 'Location', disabled: true },
        { title: 'Complete', tab: 'Complete', disabled: true }
    ];
    constructor(private _cdr: ChangeDetectorRef, private _imageService: ImageService, private edit_MetadataService: Edit_MetadataService) {

    }
    ngOnInit() {
        //Set the path to the folder where the images, that should 
        //be edited, are stored.
        this.imgDir = this._imageService.imageDir;
        //Subscribe to the edit_MetadataService to update the path to the
        //actual image
        this.edit_MetadataService.imageName$.subscribe(
            imgName => {
                this.imgPath = this.imgDir + '/' + imgName;
            }
        );
        // Set the File tab to be active.
        this.tabs.forEach(tab => {
            if (tab.tab === 'File') {
                tab.active = true;
                this._cdr.detectChanges();
            }
        });
    }

    /**
     * Set the name of the actual selected tab.
     * 
     * Used by the tab-directive, when a select-event is fired. 
     */
    public selectTab(tabName: string) {
        this.selectedTabName = tabName;
    }

    /**
     * Update tab settings (active, disabled),
     * when a new editing process should be started.
     */
    startEditing() {
        this.tabs.forEach(tab => {
            if (tab.tab === 'File') {
                tab.disabled = true;
                tab.active = false;
            } else {
                tab.disabled = false;
                if (tab.tab === 'Edit_Metadata') {
                    tab.active = true;
                }
            }
        });
        this._cdr.detectChanges();
    }

    /**
     * Update tab settings (active, disabled),
     * when an editing process should be aborted.
     */
    click_Abort() {
        this.tabs.forEach(tab => {
            if (tab.tab === 'File') {
                tab.disabled = false;
                tab.active = true;
            } else {
                tab.disabled = true;
                tab.active = false;
            }
        });
        this._cdr.detectChanges();
    }

}
