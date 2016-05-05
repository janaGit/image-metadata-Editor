import {Injectable} from 'angular2/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class Edit_MetadataService {
    private _imageName = new Subject<string>();
    private _imageDir: string;
    private _imgPath = new Subject<string>();

    imageName$ = this._imageName.asObservable();
    imgPath$ = this._imgPath.asObservable();

    setImageName(imgName: string) {
        this._imageName.next(imgName);
        this._imgPath.next(this._imageDir+'/'+imgName);
    }


    get imageDir() {
        return this._imageDir;
    }
    set imageDir(imgDir: string) {
        this._imageDir = imgDir;
    }
}