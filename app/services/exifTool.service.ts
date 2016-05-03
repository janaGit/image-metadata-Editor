import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Injectable} from 'angular2/core';


@Injectable()
export class ExifToolService {
    constructor(private _http: Http) { }
    private _getMetadata = '/getMetadata';


    getMetadata(imageName: string): Observable<string[]> {
        return this._http.get(this._getMetadata+'/'+imageName)
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

}