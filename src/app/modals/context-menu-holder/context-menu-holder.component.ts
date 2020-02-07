import { Component, HostListener } from '@angular/core';
import { ContextMenuService } from './../../services/context-menu.service';

/**
 * This class provides the context menu component. 
 * 
 * The context menu consists of the following elements:
 * 
 *           - this class
 * 
 *           - contextMenu.service
 *  
 *           - onMouseOverImage.directive
 * 
 * It is used for the images at the editor view start page and the image gallery.
 *  
 * 
 * The code for the contextMenu is from: 
 * http://stackoverflow.com/questions/34861628/angular-2-implement-a-custom-context-menu?answertab=oldest#tab-top, 
 * 
 * post from Abdulrahman, answered Apr 3 at 13:10, 
 * 
 * plunker: http://plnkr.co/edit/3klGukkbDBCOaBYqcGmr?p=preview
 * 
 * Edited by Jana Klemp
 * 
 * Thanks for the code. 
 */
@Component({
    selector: 'context-menu-holder',
    styleUrls: ['context-menu-holder.component.css'],
    templateUrl: 'context-menu-holder.component.html'
})
export class ContextMenuHolderComponent {
    /**
     * Elements that are listed in the context menu.
     */
    menuElements:string[] = [];
    /**
     * Variable to define if the context menu 
     * should be shown or not.
     */
    private isShown:boolean = false;
    /**
     * The context menu is displayed at that location.
     */
    private mouseLocation: { left: number, top: number } = { left: 0, top: 0 };


    constructor(private _contextMenuService: ContextMenuService) {
        // Subscribe to the ContextMenuService.
        this._contextMenuService.show.subscribe(e => this.showMenu(e.event, e.menuElements));
    }

    /** 
     * The css for the div: 'container'.
     */
    get locationCss() {
        return {
            'position': 'fixed',
            'display': this.isShown ? 'block' : 'none',
            left: this.mouseLocation.left + 'px',
            top: this.mouseLocation.top + 'px',
        };
    }

    /**
     * Hide the menu, when the mouse gets up.
     */
    @HostListener('mouseup', ['$event'])
    @HostListener('document:mouseup', ['$event'])
    clickedOutside(event) {
        this.isShown = false; // hide the menu
    }

    /** 
     * Show the menu and set the location of the mouse.
     * 
     * This method is executed, when the contextMenuService 
     * sends a new event via the show-Subject.
     */
    showMenu(event, menuElements) {
        this.isShown = true;
        this.menuElements = menuElements;
        this.mouseLocation = {
            left: event.clientX,
            top: event.clientY
        }
    }
}

