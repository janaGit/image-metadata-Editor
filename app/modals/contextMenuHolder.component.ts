//The code is from: 
//http://stackoverflow.com/questions/34861628/angular-2-implement-a-custom-context-menu?answertab=oldest#tab-top, 
//post from Abdulrahman, answered Apr 3 at 13:10, 
//plunker: http://plnkr.co/edit/3klGukkbDBCOaBYqcGmr?p=preview
//
//edited by Jana Klemp

import {Component} from '@angular/core';
import {ContextMenuService} from './../services/contextMenu.service';
@Component({
    selector: 'context-menu-holder',
    styles: [
        '.container{width:150px;background-color:#eee}',
        '.link{}', '.link:hover{background-color:#abc}',
        'ul{margin:0px;padding:0px;list-style-type: none}',
        '.container{z-index:2;padding-right:0px;border-radius:5px;padding-top:0.5%;padding-bottom:0.5%}',
        'li{color:#696969;}',
        'li+li { border-top: 1px solid #696969}'
    ],
    host: {
        '(mouseup)': 'clickedOutside($event)',
        '(document:mouseup)': 'clickedOutside($event)'
    },
    template:
    `<div [ngStyle]="locationCss" class="container">
      <ul>
          <li (mouseup)="link.subject.next(link.title)" class="link" *ngFor="let link of links">
              {{link.title}}
          </li>
      </ul>
    </div>
  `
})
export class ContextMenuHolderComponent {
    links = [];
    isShown = false;
    private mouseLocation: { left: number, top: number } = { left: 0, top: 0 };
    constructor(private _contextMenuService: ContextMenuService) {
        this._contextMenuService.show.subscribe(e => this.showMenu(e.event, e.obj));
    }
    // the css for the container div
    get locationCss() {
        return {
            'position': 'fixed',
            'display': this.isShown ? 'block' : 'none',
            left: this.mouseLocation.left + 'px',
            top: this.mouseLocation.top + 'px',
        };
    }
    clickedOutside(event) {
        this.isShown = false; // hide the menu
    }

    // show the menu and set the location of the mouse
    showMenu(event, links) {
        this.isShown = true;
        this.links = links;
        this.mouseLocation = {
            left: event.clientX,
            top: event.clientY
        }
    }
}

