import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EditorService } from './editor.service';

@Injectable()
export class ExifToolService{
    constructor(private _http: Http, private _editorService: EditorService) { }
    private _getMetadata = '/getMetadata';
    private _getMetadata_edited = '/getMetadata_edited';
    private _deleteAllMetadata = '/deleteAllMetadata';
    private _language: string = 'en';

    private _errorMessage;
    private _metadata: Object;
    private _metadata_edited: Object;

    set language(language) {
        this._language = language;
    }
    get language() {
        return this._language;
    }

    get metadata() {
        return this._metadata;
    }

    get metadata_edited() {
        return this._metadata_edited;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    requestMetadata() {

        return new Promise(resolve => {
            this._http.get(this._getMetadata + '/' + this._editorService.imageName + '/' + this._language)
                .map(this.extractData)
                .catch(this.handleError).subscribe(
                data => { this._metadata = data, this._errorMessage = null; resolve(); },
                error => { this._errorMessage = error; this._metadata = null; resolve(); }
                );

        });
    }
    requestMetadata_edited() {
        return new Promise(resolve => {
            this._http.get(this._getMetadata_edited + '/' + this._editorService.imageName_edited + '/' + this._language)
                .map(this.extractData)
                .catch(this.handleError).subscribe(
                data => { this._metadata_edited = data; this._errorMessage = null; resolve(); },
                error => { this._errorMessage = error; this._metadata_edited = null; resolve(); });
        });
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
        let err = error || 'Server error';
        console.error(err);
        return Observable.throw(err);
    }

}