import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MetadataService } from '../../edit-metadata/metadata.service';


@Component({
    selector: 'app-complete-template-tab',
    templateUrl: 'complete-template-tab.component.html',
    styleUrls: ['complete-template-tab.component.scss', '../../css/global-app.scss']
})
export class CompleteTemplateTabComponent implements OnInit, OnDestroy {
    metadata: Object = {};
    metadataKeys: string[] = [];
    constructor(private _cdr: ChangeDetectorRef, private _metadataService: MetadataService) {

    }


    ngOnDestroy(): void {

    }
    ngOnInit() {
        this.metadata = this._metadataService.getAllMetadata();
        this.metadataKeys = Object.keys(this.metadata);
    }

    onClickSave() {
        this._metadataService.sendMetadataToBackend();
    }
}