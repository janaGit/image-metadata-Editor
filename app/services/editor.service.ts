import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EditorService {

    private __imageName: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
    private __imageName_edited: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
    private _imageName:string;
    private _imageName_edited:string;

    imageName$ = this.__imageName.asObservable();
    imageName_edited$ = this.__imageName_edited.asObservable();

    updateImageName(imgName) {
        this._imageName = imgName;
        this.__imageName.next(imgName);
    }
    updateImageName_edited(imgName_edited) {
        this._imageName_edited = imgName_edited;
        this.__imageName_edited.next(imgName_edited);
    }
    get imageName() {
        return this._imageName;
    }
    get imageName_edited() {
        return this._imageName_edited;
    }
}