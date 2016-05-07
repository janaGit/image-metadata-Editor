import {Directive, Output, EventEmitter} from 'angular2/core';
@Directive({
    selector: '[ime_onMouseOverImage]',
    host: {
        '(mouseover)': 'mouseOver($event)',
    }
})
export class OnMouseOverImageDirective {
    @Output() ime_onMouseOverImage = new EventEmitter();
    private _src:string;
    mouseOver(event) {
        this._src=event.target.attributes.getNamedItem("src").value;
        var srcList=this._src.split('/');
        if (srcList.length>1){
        let img_name=srcList[ srcList.length-1];
        this.ime_onMouseOverImage.emit(img_name);
        }
       
    };
}


