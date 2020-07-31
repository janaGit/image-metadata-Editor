
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditorService } from './editor.service';
import { ImageService } from './image.service';
import { ReturnObject } from '../types/return-object.interface'
/**
 * This service class provides methods for requests to the backend 
 * for the management of the image metadata.
 */
@Injectable()
export class ExifToolService {
    /**
     * Server base URL
     */
    private _serverBase = '/api';
    /**
     * Restful webservice URL to get the metadata of an image that is stored
     * in the path for the editing view. 
     */
    private _getMetadata = this._serverBase + '/getMetadata';

    /**
     * Restful webservice URL to get the metadata of an image that is stored
     * in the path for the image gallery. 
     */
    private _getMetadata_edited = this._serverBase + '/getMetadata_edited';

    /**
     * Restful webservice URL to delete the metadata of an image that is stored
     * in the path for the editing view. 
     */
    private _deleteAllMetadata = this._serverBase + '/deleteAllMetadata';

        /**
     * Restful webservice URL to get the not humanreadabile metadata from an image that should be edited 
     */
    private _getMetadata_to_edit = this._serverBase + '/getMetadataToEdit';

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
     * Stores the metadata of an image that is beeing edited. 
     */
    private _metadata_to_edit: Object;

    /**
     * Stores the metadata of an image of the image gallery. 
     */
    private _metadata_edited: Object;

    constructor(private _http: HttpClient, private _editorService: EditorService, private _imageService: ImageService) { }

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
     * Get the metadata of an image of the image gallery. 
     */
    get metadata_to_edit() {
        return this._metadata_to_edit;
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
    async requestMetadata() {
        try {
            const data = await this._http.get(this._getMetadata + '/' + this._editorService.imageName + '/' + this._language).pipe(
                map(this.extractData)).toPromise();
            this._metadata = data;
            this._errorMessage = null;
        } catch (error) {
            this._errorMessage = error;
            this._metadata = null;
        }
    }

    /**
     * Method that does a request to the backend to get the metadata
     * of a specific image from the image gallery.
     */
    async requestMetadata_edited() {
        try {
            const data = await this._http.get(this._getMetadata_edited + '/' + this._editorService.imageName_edited + '/' + this._language).pipe(
                map(this.extractData)).toPromise();
            this._metadata_edited = data;
            this._errorMessage = null;
        } catch (error) {
            this.handleError(error);
            this._errorMessage = error;
            this._metadata_edited = null;
        }

    }

    /**
     * Method that does a request to the backend to get the metadata with tag names
     * of a specific image from the image folder.
     */
    async requestMetadata_toEdit() {
        try {
            const data = await this._http.get(this._getMetadata_to_edit + '/' + this._editorService.imageName).pipe(
                map(this.extractData)).toPromise();
            this._metadata_to_edit = data;
            this._errorMessage = null;
        } catch (error) {
            this.handleError(error);
            this._errorMessage = error;
            this._metadata_to_edit = null;
        }

    }

    /**
     * Method that deletes the metadata of images of the editing view.
     * @param imageName Image name of Image that metadata should be deleted.
     * @return Name of Image after deleted image data. (Image is renamed after deleting image data)
     */
    async deleteAllMetadataOfImageAndUpdateImageNamesInImagesFolder(imageName: string): Promise<string> {
        try {
            const returnObject = await this._http.post(this._deleteAllMetadata + '/' + imageName, "").pipe(
                map(this.extractReturnObject)).toPromise();
            this._imageService.updateImageNamesInFolder();
            return returnObject.payload.imageName;
        }
        catch (error) {
            this.handleError(error)
        };

    }
        /** 
     * Method that deletes the metadata of images of the editing view.
     * @param imageName Image name of Image that metadata should be deleted.
     * @return Name of Image after deleted image data. (Image is renamed after deleting image data)
     */
    async deleteAllMetadataOfImage(imageName: string): Promise<string> {
        try {
            const returnObject = await this._http.post(this._deleteAllMetadata + '/' + imageName, "").pipe(
                map(this.extractReturnObject)).toPromise();
            return returnObject.payload.imageName;
        }
        catch (error) {
            this.handleError(error)
        };

    }


    private extractData(res: any) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        return res.data || {};
    }
    private extractReturnObject(res: any): ReturnObject {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        return res.body || {};
    }
    private handleError(error: any) {
        let err = error || 'Error on server communication';
        if (error.status === 404) {
            console.warn(error);
        } else {
            console.error(err);
        }

    }

}