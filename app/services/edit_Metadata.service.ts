import {Injectable} from 'angular2/core';

@Injectable()      
export class Edit_MetadataService {
_imageName:string;
set imageName(imgName:string){
    this._imageName=imgName;
}

}