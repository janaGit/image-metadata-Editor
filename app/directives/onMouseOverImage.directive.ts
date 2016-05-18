import {Directive, Output, EventEmitter,ElementRef} from 'angular2/core';

@Directive({
    selector: '[ime_onMouseOverImage]',
    host: {
        '(mouseover)': 'mouseOver($event)',
        '(click)': 'mouseClicked($event)'
    }
})
export class OnMouseOverImageDirective {
    @Output() ime_onMouseOverImage = new EventEmitter();
    private _src: string;
    private _event: { event: string; img_name: string; element: ElementRef };
    
    mouseOver(event) {
        let img_name = this.getImage(event);
        this._event = { event: 'mouseOver', img_name: img_name, element:event.target };
        this.ime_onMouseOverImage.emit(this._event);
    };
    mouseClicked(event) {
        let img_name = this.getImage(event);
        this._event = { event: 'mouseClicked', img_name: img_name, element:event.target };
        this.ime_onMouseOverImage.emit(this._event);
    };
    getImage(event) {
        this._src = event.target.attributes.getNamedItem("src").value;
        var srcList = this._src.split('/');
        if (srcList.length > 1) {
            let img_name = srcList[srcList.length - 1];
            return img_name;
        }
        return '';
    }
}


