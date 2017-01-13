//The code is from: 
//http://stackoverflow.com/questions/34861628/angular-2-implement-a-custom-context-menu?answertab=oldest#tab-top, 
//post from Abdulrahman, answered Apr 3 at 13:10, 
//plunker: http://plnkr.co/edit/3klGukkbDBCOaBYqcGmr?p=preview

import {Injectable} from 'angular2/core';
import {Subject} from 'rxjs/Rx';

@Injectable()
export class ContextMenuService{
    public show:Subject<{event:MouseEvent,obj:any[]}> = new Subject();
}


