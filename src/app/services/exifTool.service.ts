import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EditorService } from './editor.service';

/**
 * This service class provides methods for requests to the backend 
 * for the management of the image metadata.
 */
@Injectable()
export class ExifToolService {

    /**
     * Restful webservice URL to get the metadata of an image that is stored
     * in the path for the editing view. 
     */
    private _getMetadata = '/getMetadata';

    /**
     * Restful webservice URL to get the metadata of an image that is stored
     * in the path for the image gallery. 
     */
    private _getMetadata_edited = '/getMetadata_edited';

    /**
     * Restful webservice URL to delete the metadata of an image that is stored
     * in the path for the editing view. 
     */
    private _deleteAllMetadata = '/deleteAllMetadata';

    /**
     * Actual language-setting for the image metadata. 
     */
    private _language: string = 'en';

    /**
     * Storage of an error message that is send from the backend.
     */
    private _errorMessage;

    /**
     * Stores the metadata of an image of the editing view. 
     */
    private _metadata: Object;

    /**
     * Stores the metadata of an image of the image gallery. 
     */
    private _metadata_edited: Object;

    constructor(private _http: Http, private _editorService: EditorService) { }

    // Getter and setter
    /**
     * Set the language for the image metadata.
     */
    set language(language) {
        this._language = language;
    }
    /**
     * Get the actual language for the image metadata.
     */
    get language() {
        return this._language;
    }

    /**
     * Get the metadata of an image of the editing view. 
     */
    get metadata() {
        return this._metadata;
    }
    /**
     * Get the metadata of an image of the image gallery. 
     */
    get metadata_edited() {
        return this._metadata_edited;
    }
   
    /**
     * Get the error message that is possibly returned from the server.
     */
    get errorMessage() {
        return this._errorMessage;
    }

    /**
     * Method that does a request to the backend to get the metadata
     * of a specific image from the editing view.
     */
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

    /**
     * Method that does a request to the backend to get the metadata
     * of a specific image from the image gallery.
     */
    requestMetadata_edited() {
        return new Promise(resolve => {
            this._http.get(this._getMetadata_edited + '/' + this._editorService.imageName_edited + '/' + this._language)
                .map(this.extractData)
                .catch(this.handleError).subscribe(
                data => { this._metadata_edited = data; this._errorMessage = null; resolve(); },
                error => { this._errorMessage = error; this._metadata_edited = null; resolve(); });
        });
    }

    /**
     * Method that deletes the metadata of images of the editing view.
     */
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