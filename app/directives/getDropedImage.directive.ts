import {Directive, Output, EventEmitter} from '@angular/core';
@Directive({
    selector: '[ee_getDropedImage]',
    host: {
        '(drop)': 'fileDroped($event)',
        '(dragover)': 'dragOver($event)'
    },
    providers: []
})
export class GetDropedImageDirective {
    @Output() ee_getDropedImage = new EventEmitter();

    fileDroped(event) {
        event.preventDefault();
        //var path = event.dataTransfer.getData("text");
        var data = event.dataTransfer.files[0];
        this.ee_getDropedImage.emit(data);
    };
    dragOver(event) {
        event.preventDefault();
    }

}


