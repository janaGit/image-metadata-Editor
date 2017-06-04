import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * This directive returns the data of a droped
 * file via an event emitter.
 */
@Directive({
    selector: '[return-droped-image]'
})
export class ReturnDropedImageDirective {
    /**
     * The event emitter returns the droped file.
     */
    @Output() returnDropedImage = new EventEmitter();
 
    /**
     * This method is executed when a drop-event is triggered.
     * 
     * The droped file is send via the event emitter: returnDropedImage.
     */
    @HostListener('drop', ['$event'])
    fileDroped(event) {
        event.preventDefault();

        var file = event.dataTransfer.files[0];
        this.returnDropedImage.emit(file);
    };

    /**
     * The default dragover-event has to be prevented,
     * as otherwise the fileDroped-method is not executed 
     * and the image is opened in another tab. 
     */
    @HostListener('dragover', ['$event'])
    dragOver(event) {
        event.preventDefault();
    }

}


