import {Directive, Output,Input, EventEmitter,ElementRef} from '@angular/core';
import  {ContextMenuService} from './../services/contextMenu.service';
@Directive({
    selector: '[ime_onMouseOverImage]',
    host: {
        '(mouseover)': 'mouseOver($event)',
        '(click)': 'mouseClicked($event)',
        '(contextmenu)': 'mouseRightClick($event)'
    }
})
export class OnMouseOverImageDirective {
    @Output() ime_onMouseOverImage = new EventEmitter();
    private _src: string;
    private _event: { event: string; img_name: string; element: ElementRef };
    @Input('contextMenuElements') contextMenuElements;
    constructor(private _contextMenuService:ContextMenuService){
        
    }
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
    mouseRightClick(event:MouseEvent){
        event.preventDefault();
        this._contextMenuService.show.next({event:event,obj:this.contextMenuElements});
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


