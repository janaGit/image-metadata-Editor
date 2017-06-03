import { Directive, Output, Input, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { ContextMenuService } from './../services/context-menu.service';
import { ContextMenu } from './../types/contextMenu.type';
import { MouseOverImageEvent } from './../types/mouseOverImageEvent.type';
/**
 * This directive can be used for <img/> tags. 
 * 
 * It returns MouseOverImageEvents and uses (if contextMenuElements exist)
 * the ContextMenuService to display a context menu.
 * 
 * The following mouse events are implemented:
 * 
 * - mouseover
 * 
 * - mouseClicked 
 * 
 * - contextmenu
 */
@Directive({
    selector: '[onMouseOverImage]'
})
export class OnMouseOverImageDirective {
    /**
     * This variable stores the mouseOverImage event
     * that is distributed by the onMouseOverImage EventEmitter.
     */
    private _event: MouseOverImageEvent;

    /**
     * This EventEmitter distributes mouseOverImage events.
     */
    @Output() onMouseOverImage = new EventEmitter();

    /**
     * Context menu elements that are send via the 
     * contextMenuService to the contextMenuHolder.component 
     * when a right-click event triggers.
     */
    @Input('contextMenuElements') contextMenuElements: ContextMenu[];


    constructor(private _contextMenuService: ContextMenuService) {

    }

    /**
     * This method is executed, when a mouseover event triggers.
     * 
     * Then the onMouseOverImage-EventEmitter emits an object with:
     * 
     * event: Name of the event = 'mouseOver'.  
     * 
     * element: The element that triggered the event.
     * 
     * imgName: The image name or ''.
     */
    @HostListener('mouseover', ['$event'])
    mouseOver(event) {
        let img_name = this.getImageName(event);
        this._event = { eventName: 'mouseOver', imgName: img_name, element: event.target };
        this.onMouseOverImage.emit(this._event);
    };

    /**
     * This method is executed, when a mouse-click event triggers.
     * 
     * Then the onMouseOverImage-EventEmitter emits an object with:
     * 
     * event: Name of the event = 'mouseClicked'. 
     * 
     * element: The element that triggered the event.
     * 
     * imgName: The image name or '' .
     */
    @HostListener('click', ['$event'])
    mouseClicked(event) {
        let img_name = this.getImageName(event);
        this._event = { eventName: 'mouseClicked', imgName: img_name, element: event.target };
        this.onMouseOverImage.emit(this._event);
    };

    /**
     * To display the context menu.
     * 
     * This method is executed, when a right-click event triggers.
     * 
     * The event and the contextMenuElements are then send via
     * the contextMenuService to the contextMenuHolder.component.
     * 
     * If no contextMenuElements are defined, then nothing happens.
     */
    @HostListener('contextmenu', ['$event'])
    mouseRightClick(event: MouseEvent) {
        event.preventDefault();
        if (this.contextMenuElements) {
            this._contextMenuService.show.next({ event: event, menuElements: this.contextMenuElements });
        }
    };

    /**
     * This method returns the image name by using the src-attribute
     * that can exist in the event object.
     * 
     * If 'src' has no content, then '' is returned.
     */
    private getImageName(event) {
        let src = event.target.attributes.getNamedItem("src").value;
        var srcList = src.split('/');

        if (srcList.length > 1) {
            let img_name = srcList[srcList.length - 1];
            return img_name;
        }

        return '';
    }
}


