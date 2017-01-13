import {Injectable} from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class Edit_MetadataService {
    private _imageName = new Subject<string>();

    imageName$ = this._imageName.asObservable();

    setImageName(imgName: string) {
        this._imageName.next(imgName);
    }


   
}