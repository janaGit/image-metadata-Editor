import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import {TabDirective} from 'ng2-bootstrap/ng2-bootstrap';


import {Edit_MetadataService} from './services/edit_Metadata.service';
import {ImageService}     from './../services/image.service';


@Component({
    selector: 'edit-Metadata',
    templateUrl: 'editMetadata.component.html',
    styleUrls: ['editMetadata.component.css'],
})

export class EditMetadataComponent implements OnInit {
    public selectedTab: string;
    public imgPath: string;
    public imgDir:string;
    public tabs: Array<any> = [
        { title: 'File', tab: 'File' },
        { title: 'Edit Metadata', tab: 'Edit_Metadata', disabled: true },
        { title: 'Additional Metadata', tab: 'Metadata', disabled: true },
        { title: 'Location', tab: 'Location', disabled: true },
        { title: 'Complete', tab: 'Complete', disabled: true }
    ];
    constructor(private _cdr: ChangeDetectorRef,private _imageService: ImageService, private edit_MetadataService: Edit_MetadataService) {

    }
    ngOnInit() {
        this.imgDir = this._imageService.imageDir;
        this.edit_MetadataService.imageName$.subscribe(
            imgName=> {
                this.imgPath = this.imgDir+'/'+imgName;
            }
        );

        this.tabs.forEach(tab => {
            if (tab.tab === 'File') {
                tab.active = true;
               this._cdr.detectChanges();
            }
        });
    }
    startEditing() {
        if (true) {
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

    }
    public selectTab(selectedTab: TabDirective) {
        this.tabs.forEach(tab => {
            if (tab.title === selectedTab.heading) {
                this.selectedTab = tab.tab;
            }
        })
    }
    click_Abort() {
        for (var i = 0; i < this.tabs.length; i++) {
            var tab = this.tabs[i];
            if (tab.tab === 'File') {
                this.selectedTab = tab.tab;
                tab.disabled = false;
                tab.active = true;
            } else {
                tab.disabled = true;
                tab.active = false;
            }
        }
        this._cdr.detectChanges();

    }

}
