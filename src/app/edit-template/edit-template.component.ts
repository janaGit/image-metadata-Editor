import { Component, ChangeDetectorRef, OnInit } from '@angular/core';


import { EditorService } from '../services/editor.service';
import { ImageService } from '../services/image.service';
import { MetadataService } from '../edit-metadata/metadata.service';
import { MetadataFromImageService } from 'app/edit-metadata/metadata-from-image.service';
import { EditTemplateService } from './edit-template.service';

/**
 *  Main component of the editor view.
*/
@Component({
    selector: 'edit-template',
    templateUrl: 'edit-template.component.html',
    styleUrls: ['edit-template.component.scss', '../css/global-app.scss']
})
export class EditTemplateComponent implements OnInit {
    /**
     * Name of the actual selected tab.
     */
    public selectedTab: string = 'start_template';

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
        { title: 'Start Template', tab: 'start_template', disabled: true },
        { title: 'Existing Metadata', tab: 'existing_metadata', disabled: true },
        { title: 'Edit Metadata', tab: 'metadata', disabled: true },
        { title: 'Categories', tab: 'categories', disabled: true },
        { title: 'Location', tab: 'location', disabled: true }
    ];
    constructor(private _cdr: ChangeDetectorRef, private _imageService: ImageService, private _editorService: EditorService, private _editTemplateService: EditTemplateService) {

    }


    ngOnInit() {
        // Set the File tab to be active.
        this.tabs.forEach(tab => {
            if (tab.tab === 'start_template') {
                tab.active = true;
                this._editorService.updateIsFileTabOpen(true);
            }
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
    }
    /**
     * Set the name of the actual selected tab.
     * 
     * Used by the tab-directive, when a select-event is fired. 
     */
    public selectTab(tab: string) {
        let _tab = this.tabs.find(_tab => { return _tab.tab === tab });
        this.selectedTab = _tab.tab;
    }

    /**
     * Update tab settings (active, disabled),
     * when a new editing process should be started.
     */
    startEditing() {
        this.tabs.forEach(tab => {
            if (tab.tab === 'start_template') {
                tab.disabled = true;
                tab.active = false;
            } else {
                tab.disabled = false;
                if (tab.tab === 'existing_metadata') {
                    tab.active = true;
                }
            }
        });
        this._editorService.updateIsFileTabOpen(false);
        this.selectTab('existing_metadata');
        this.templateName = this._editTemplateService.templateName;
        this._cdr.detectChanges();
    }

    /**
     * Update tab settings (active, disabled),
     * when an editing process should be aborted.
     */
    click_Abort() {
        this.tabs.forEach(tab => {
            if (tab.tab === 'start_template') {
                tab.disabled = false;
                tab.active = true;
            } else {
                tab.disabled = true
                tab.active = false;
            }
        });
        this._editorService.updateIsFileTabOpen(true);
        this.selectTab('start_template');
        this.templateName = "";
        this._cdr.detectChanges();
        this._editTemplateService.resetMetadata();


    }

    clickSaveAndQuit() {

    }
}
