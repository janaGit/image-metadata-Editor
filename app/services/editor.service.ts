import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EditorService {
    private _imageName: string;
    private _imageName_edited: string;

    get imageName(): string {
        return this._imageName;
    }
    set imageName(imgName) {
        this._imageName = imgName;
    }
    get imageName_edited() {
        return this._imageName_edited;
    }
    set imageName_edited(imgName) {
        this._imageName_edited = imgName;
    }



}