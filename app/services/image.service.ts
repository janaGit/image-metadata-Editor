import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Injectable} from 'angular2/core';


@Injectable()
export class ImageService {
    constructor(private _http: Http) { }
    private _getImagesUrl = '/getImageNames';
    private _postImageUrl = '/newImage';
    private _deleteImageUrl = '/deleteImage';

    getImageNames(): Observable<string[]> {
        return this._http.get(this._getImagesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || {};
    }
    private handleError(error: any) {
        let err = error.message || 'Server error';
        console.error(err);
        return Observable.throw(err);
    }

    sendImage(imageFile: File) {
        var self = this;
        return new Promise<string>(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('POST', self._postImageUrl, true);
            var formData = new FormData();

            formData.append('image', imageFile);
            request.onloadend = function() {
                resolve(request.responseText);
            };

            request.send(formData);

        });

    }
    deleteImage(imageName: string): Observable<string[]> {
        return this._http.delete(this._deleteImageUrl + '/' + imageName)
            .map(this.extractData)
            .catch(this.handleError);
    }

}