import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';


import { EditorService } from './../services/editor.service';
import { ImageService } from './../services/image.service';
import { EditAllMetadataService } from './edit-all-metadata.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { EditAllMetadataFromTemplateService } from './edit-all-metadata-from-template.service';
import { Subscription } from 'rxjs';

/**
 *  Main component of the editor view.
*/
@Component({
    selector: 'edit-all-metadata',
    templateUrl: 'edit-all-metadata.component.html',
    styleUrls: ['edit-all-metadata.component.scss']
})
export class EditAllMetadataComponent implements OnInit, OnDestroy {
    private _imageSelectedImageNameSubscription: Subscription;
    private _templateNameSubscription: Subscription;
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


    templateName: string = "";
    /**
     * Tabs for the different steps of the editing process.
     */
    public tabs: Array<any> = [
        { title: 'File', tab: 'file' },
        { title: 'Template', tab: 'template', disabled: true },
        { title: 'Existing Metadata', tab: 'existing_metadata', disabled: true },
        { title: 'Edit Metadata', tab: 'metadata', disabled: true },
        { title: 'Categories', tab: 'categories', disabled: true },
        { title: 'Location', tab: 'location', disabled: true },
        { title: 'Complete', tab: 'complete', disabled: true }
    ];
    constructor(private _cdr: ChangeDetectorRef, private _imageService: ImageService, private _editorService: EditorService, private _metadataService: EditAllMetadataService, private _metadataFromImageService: MetadataFromImageService, private _metadataFromTemplateService: EditAllMetadataFromTemplateService) {

    }

    ngOnDestroy(): void {
        this._imageSelectedImageNameSubscription.unsubscribe();
        this._templateNameSubscription.unsubscribe();
      }
    ngOnInit() {
        // Set the File tab to be active.
        this.tabs.forEach(tab => {
            if (tab.tab === 'file') {
                tab.active = true;
                this._editorService.updateIsFileTabOpen(true);
            }
        });

        this._imageSelectedImageNameSubscription = this._editorService.imageName$.subscribe(imgName => {
            this.imgPath = this._imageService.imageDir + '/' + imgName;
        });

        this._templateNameSubscription = this._metadataFromTemplateService.templateName$.subscribe(templateName => {
            this.templateName = templateName;
        });
    }

    /**
     * Set the name of the actual selected tab.
     * 
     * Used by the tab-directive, when a select-event is fired. 
     */
    public selectTabByTitle(tabTitle: string) {
        let tab = this.tabs.find(tab => { return tab.title === tabTitle });
        this.selectedTab = tab.tab;
        if (this.selectedTab === 'file') {
            this._editorService.updateIsFileTabOpen(true);
        } else {
            this._editorService.updateIsFileTabOpen(false);
        }
    }
    /**
     * Set the name of the actual selected tab.
     * 
     * Used by the tab-directive, when a select-event is fired. 
     */
    public selectTab(tab: string) {
        let _tab = this.tabs.find(_tab => { return _tab.tab === tab });
        this.selectedTab = _tab.tab;
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
                if (tab.tab === 'template') {
                    tab.active = true;
                }
            }
        });
        this.selectTab('template');
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
        this._metadataService.resetMetadata();
        this._metadataFromTemplateService.resetTemplate();
        this._metadataFromImageService.resetMetadata();

    }


}
