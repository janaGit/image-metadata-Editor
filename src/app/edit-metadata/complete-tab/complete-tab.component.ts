import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MetadataService } from 'app/services/metadata.service';


@Component({
    selector: 'complete-tab',
    templateUrl: 'complete-tab.component.html',
    styleUrls: ['complete-tab.component.scss', '../../css/global-app.scss']
})
export class CompleteComponent implements OnInit, OnDestroy {
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