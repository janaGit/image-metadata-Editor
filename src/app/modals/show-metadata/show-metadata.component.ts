import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SimpleChange } from '@angular/core';
import { ExifToolService } from './../../services/exif-tool.service';


/**
 * This class provides a modal that shows a table with the metadata
 * of the actual selected image. It is used by the editor view at the 
 * start page.
 */
@Component({
    selector: 'showMetadata',
    templateUrl: 'show-metadata.component.html',
    styleUrls: ['show-metadata.component.css']
})
export class ShowMetadataComponent implements OnInit {
    /**
     * Actual status of the modal
     * 
     * shown: true 
     * 
     * not shown: false
     */
    _display: boolean = false;
    /**
     * This variable stores the metadata of an image.
     */
    private metadata = {};
    /**
     * This variable stores the keys of the metadata.
     */
    metadata_keys = [];
    /**
     * The status if the modal is visible of hidden can be 
     * externally defined and changed.
     */
    @Input() get display() {
        return this._display;
    }
    /**
   * Event emitter that informs other components about the
   * actual status (shown/hidden) of the modal.
   */
    @Output() displayChange = new EventEmitter<boolean>();
    constructor(private _exifToolService: ExifToolService) { }

    ngOnInit() {

    }
    /**
     * This method sets the value for the visibility of the modal.
     * 
     * If the modal should be shown, then the metadata of the actual image 
     * are requested and bind to the local metadata variable.
     * 
     * true: visible
     * 
     * false: hidden
     */
    set display(display: boolean) {

        this.displayChange.emit(this._display);
        if (display == true) {
            this.showMetadata(display);
        }else{
            this._display = display;
        }
    }

    /**
     * This method executes a request for getting the metadata 
     * of the actual image by using the exifToolService.
     * If the request was successfull, then the modal is shown.
     * If not, then an alert-window with an error message is displayed. 
     */
    async showMetadata(display: boolean) {
    try{
      await this._exifToolService.requestMetadata();
      let __metadata = this._exifToolService.metadata;
                if (__metadata) {
                    this.metadata = __metadata;
                    this.metadata_keys = Object.keys(this.metadata);
                    //actualize _display variable
                     this._display = display;
                } else {
                    alert("showMetadata error:"+this._exifToolService.errorMessage);
                }
        }catch(e){
            alert("showMetadata error:"+e .errorMessage);
        }
    }
    
}
