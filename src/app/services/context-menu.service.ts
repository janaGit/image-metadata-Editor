import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ContextMenu } from './../types/context-menu.type';
/**
 * This class provides the context menu service. 
 * 
 * The context menu consists of the following elements:
 * 
 *           - this class
 * 
 *           - contextMenuHolder.component
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
@Injectable()
export class ContextMenuService {
    public show: Subject<{ event: MouseEvent, menuElements: ContextMenu[] }> = new Subject();
}


