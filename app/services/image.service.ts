import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

/**
 * This service class provides methods for requests to the backend 
 * for the management of the images.
 */
@Injectable()
export class ImageService {

    /**
     * Path to the folder for the images that are shown in the editing view.
     */
    private _imageDir: string;

    /**
     *  Path to the folder for the images that are shown in the image gallery.
     */
    private _imageDir_edited: string;


    /**
    * Restful webservice URL to get the image names that could be edited. 
    */
    private _getImagesUrl = '/getImageNames';

    /**
     * Restful webservice URL to get the image names for the image gallery. 
     */
    private _getImages_editedUrl = '/getImageNames_edited';

    /**
    *    Restful webservice URL to insert a new image into the image folder. 
    */
    private _postImageUrl = '/newImage';

    /**
    *    Restful webservice URL to delete an image that exists in the image folder. 
    */
    private _deleteImageUrl = '/deleteImage';
   
    /**
     * Restful webservice URL to move an image from the image gallery (path: imageDir_edited)
     * back to the editing view (path: imageDir).
     */
    private _postMoveImage_Back = '/moveImageBackForEditing';
    
    /**
     * Restful webservice URL to move an image from the editing view (path:imgDir)
     * to the image gallery (path: imageDir_edited).
     */
    private _postMoveImage_ToImageGallery = '/moveImageToImageGallery';

    constructor(private _http: Http) { }

    // Getter and setter methods:

    /**
     * Get the path where the images for the editing view are stored.
     */
    get imageDir() {
        return this._imageDir;
    }

    /**
     * Set the path where the images for the editing view are stored.
     */
    set imageDir(imgDir: string) {
        this._imageDir = imgDir;
    }

    /**
     * Get the path where the images for the image gallery are stored.
     */
    set imageDir_edited(imgDir_edited: string) {
        this._imageDir_edited = imgDir_edited;
    }

    /**
     * Set the path where the images for the image gallery are stored.
     */
    get imageDir_edited() {
        return this._imageDir_edited;
    }

    /**
     * Method that requests the image names for the editing view.
     */
    getImageNames(): Observable<string[]> {
        return this._http.get(this._getImagesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Method that requests the image names for the image gallery.
     */
    getImageNames_edited(): Observable<string[]> {
        return this._http.get(this._getImages_editedUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Method that posts an image to the backend. The image is then 
     * stored in the folder of imageDir and shown in the editing view.
     * 
     * @param imageFile  Image data
     */
    sendImage(imageFile: File) {
        return new Promise<string>((resolve, reject) =>{
            let request = new XMLHttpRequest();
            request.open('POST', this._postImageUrl, true);
            let formData = new FormData();

            formData.append('image', imageFile);
            request.onloadend = function () {
                resolve(request.responseText);
            };

            request.send(formData);

        });

    }

    /**
    * Method that does a delete request for images that are located in the path: imageDir. 
     */
    deleteImage(imageName: string): Observable<string[]> {
        return this._http.delete(this._deleteImageUrl + '/' + imageName)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Method that does a request for moving a specific image from the image gallery
     * (path: imageDir_edited) back to the editing view (path: imageDir).
     */
    moveImageBackForEditing(imageName: string): Observable<string> {
        return this._http.post(this._postMoveImage_Back + '/' + imageName, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Method that does a request for moving a specific image from the editing view
     * (path: imageDir) to the image gallery (path: imageDir_edited).
     */
    moveImageToImageGallery(imageName: string): Observable<string> {
        return this._http.post(this._postMoveImage_ToImageGallery + '/' + imageName, "")
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