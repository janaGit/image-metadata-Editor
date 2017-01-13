import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Injectable} from 'angular2/core';
import {Subject} from 'rxjs/Rx';

@Injectable()
export class ExifToolService {
    constructor(private _http: Http) { }
    private _getMetadata = '/getMetadata';
    private _getMetadata_edited = '/getMetadata_edited';
    private _deleteAllMetadata = '/deleteAllMetadata';
    private _language: string = 'en';
    private _imageName: string;
    private _imageName_edited: string;
    private _metadata: Subject<Observable<any>> = new Subject();
    private _metadata_edited: Subject<Observable<any>> = new Subject();
    metadata$ = this._metadata.asObservable();
    metadata_edited$ = this._metadata_edited.asObservable();

    set language(language) {
        this._language = language;
        this.requestMetadata();
        this.requestMetadata_edited();
    }
    get language() {
        return this._language;
    }
    set imageName(imgName) {
        this._imageName = imgName;
        this.requestMetadata();
    }
    get imageName() {
        return this._imageName;
    }
    set imageName_edited(imgName) {
        this._imageName_edited = imgName;
        this.requestMetadata_edited();
    }
    get imageName_edited() {
        return this._imageName_edited;
    }
    requestMetadata() {
        this._http.get(this._getMetadata + '/' + this.imageName + '/' + this._language)
            .map(this.extractData)
            .catch(this.handleError).subscribe(
            data => { this._metadata.next(data); },
            error => { this._metadata.next(error); });
    }
    requestMetadata_edited() {
        this._http.get(this._getMetadata_edited + '/' + this.imageName_edited + '/' + this._language)
            .map(this.extractData)
            .catch(this.handleError).subscribe(
            data => { this._metadata_edited.next(data); },
            error => { this._metadata_edited.next(error); });
    }
    deleteAllMetadata(imageName): Observable<string[]> {
        return this._http.post(this._deleteAllMetadata + '/' + imageName, "")
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