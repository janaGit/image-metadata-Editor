import { Component, ChangeDetectorRef, OnInit } from '@angular/core';


import { EditorService } from './../services/editor.service';
import { ImageService } from './../services/image.service';

/**
 *  Main component of the editor view.
*/
@Component({
    selector: 'edit-metadata',
    templateUrl: 'edit-metadata.component.html',
    styleUrls: ['edit-metadata.component.css']
})
export class EditMetadataComponent implements OnInit {
    /**
     * Name of the actual selected tab.
     */
    public selectedTab: string = 'file';

    /*
     * Name of the folder where the images are stored 
     * that should be edited.
     */
    public imgDir: string;
    /**
     * Returns the path  to the actual selected image:
     * 
     * imgDir/imgName
     */
    imgPath: string;

    /**
     * Tabs for the different steps of the editing process.
     */
    public tabs: Array<any> = [
        { title: 'File', tab: 'file' },
        { title: 'Edit Metadata', tab: 'Edit_Metadata', disabled: true },
        { title: 'Additional Metadata', tab: 'Metadata', disabled: true },
        { title: 'Location', tab: 'Location', disabled: true },
        { title: 'Complete', tab: 'Complete', disabled: true }
    ];
    constructor(private _cdr: ChangeDetectorRef, private _imageService: ImageService, private _editorService: EditorService) {

    }


    ngOnInit() {
        // Set the File tab to be active.
        this.tabs.forEach(tab => {
            if (tab.tab === 'file') {
                tab.active = true;
                this._editorService.updateIsFileTabOpen(true);
                this._cdr.detectChanges();
            }
        });

        this._editorService.imageName$.subscribe(imgName => {
            this.imgPath = this._imageService.imageDir + '/' + imgName;
        });
    }

    /**
     * Set the name of the actual selected tab.
     * 
     * Used by the tab-directive, when a select-event is fired. 
     */
    public selectTab(tabTitle: string) {
        let tab = this.tabs.find(tab => { return tab.tab == tabTitle });
        this.selectedTab = tab.tab;
        if (this.selectedTab === 'file') {
            this._editorService.updateIsFileTabOpen(true);
        } else {
            this._editorService.updateIsFileTabOpen(false);
        }
    }

    /**
     * Update tab settings (active, disabled),
     * when a new editing process should be started.
     */
    startEditing() {
        this.tabs.forEach(tab => {
            if (tab.tab === 'file') {
                tab.disabled = true;
                tab.active = false;
            } else {
                tab.disabled = false;
                if (tab.tab === 'Edit_Metadata') {
                    tab.active = true;
                }
            }
        });
        this.selectTab('Edit_Metadata');
        this._cdr.detectChanges();
    }

    /**
     * Update tab settings (active, disabled),
     * when an editing process should be aborted.
     */
    click_Abort() {
        this.tabs.forEach(tab => {
            if (tab.tab === 'file') {
                tab.disabled = false;
                tab.active = true;
            } else {
                tab.disabled = true;
                tab.active = false;
            }
        });
        this.selectTab('file');
        this._cdr.detectChanges();
    }


}
