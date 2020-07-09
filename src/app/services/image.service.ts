
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditorService } from './editor.service';
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
     *  Path to the folder for the images that are shown in the original images view.
     */
    private _imageDir_original: string;
    /**
   *  Path to the folder for the images that are shown in the bottom bar of the 
   *  image gallery (completely edited images). Folder: images_complete
   * 
   */
    private _imageDir_complete: string;

    /**
     * Server base URL
     */
    private _serverBase = '/api';
    /**
    * Restful webservice URL to get the image names that could be edited. 
    */
    private _getImagesUrl = this._serverBase + '/getImageNames';

    /**
     * Restful webservice URL to get the image names for the image gallery (edited images). 
     */
    private _getImages_editedUrl = this._serverBase + '/getImageNames_edited';

    /**
     * Restful webservice URL to get the image names of the folder: images_complete (completely edited). 
     */
    private _getImages_completeUrl = this._serverBase + '/getImageNames_complete';


    /**
     * Restful webservice URL to get the image names for the original images. 
     */
    private _getImages_originalUrl = this._serverBase + '/getImageNames_original';
    /**
    *    Restful webservice URL to insert a new image into the image folder. 
    */
    private _postImageUrl = this._serverBase + '/newImage';

    /**
    *    Restful webservice URL to delete an image that exists in the image folder. 
    */
    private _deleteImageUrl = this._serverBase + '/deleteImage';

    /**
     * Restful webservice URL to move an image from the image gallery (path: imageDir_edited)
     * back to the editing view (path: imageDir).
     */
    private _postMoveImage_Back = this._serverBase + '/moveImageBackForEditing';

    /**
     * Restful webservice URL to move an image from the editing view (path:imgDir)
     * to the image gallery (path: imageDir_edited).
     */
    private _postMoveImage_ToImageGallery = this._serverBase + '/moveImageToImageGallery';

    /**
     * Restful webservice URL to move an image from the image gallery (path: imageDir_edited)
     * to the imagesComplete folder (path: imageDir_complete).
     */
    private _postMoveImage_ToImagesComplete = this._serverBase + '/moveImageToImagesComplete';

    /**
     * Restful webservice URL to copy an image from the original images view (path:imgDir_original)
     * to the editing view (path: imageDir_edited).
     */
    private _postCopyImage_ForEditing = this._serverBase + '/copyImageForEditing';


    constructor(private _http: HttpClient, private _editorService: EditorService) {
        this.updateImageNamesOfAllFolders();
    }



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
     * Set the path where the images for the image gallery are stored.
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
     * Set the path where the original images are stored.
     */
    get imageDir_original() {
        return this._imageDir_original;
    }
    /**
     * Set the path where the original images are stored.
     */
    set imageDir_original(imgDir_original: string) {
        this._imageDir_original = imgDir_original;
    }

    /**
     * Set the path where the completely edited images are stored.
     */
    get imageDir_complete() {
        return this._imageDir_complete;
    }
    /**
     * Set the path where the completely edited images are stored.
     */
    set imageDir_complete(imgDir_complete: string) {
        this._imageDir_complete = imgDir_complete;
    }

    /**
     * Method that requests the image names for the editing view.
     */
    async getImageNames(): Promise<string[]> {
        try {
            return this._http.get(this._getImagesUrl).pipe(
                map(this.extractData)).toPromise();
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Method that requests the image names for the image gallery.
     */
    getImageNames_edited(): Promise<string[]> {
        try {
            return this._http.get(this._getImages_editedUrl).pipe(
                map(this.extractData)).toPromise();
        } catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Method that requests the image names for the image gallery.
     */
    getImageNames_complete(): Promise<string[]> {
        try {
            return this._http.get(this._getImages_completeUrl).pipe(
                map(this.extractData)).toPromise();
        } catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Method that requests the image names for the original images.
     */
    getImageNames_original(): Promise<string[]> {
        try {
            return this._http.get(this._getImages_originalUrl).pipe(
                map(this.extractData)).toPromise();
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Method that posts an image to the backend. The image is then 
     * stored in the folder of imageDir_original, then it is copied to the
     * images folder and shown in the editing view.
     * 
     * @param imageFile  Image data
     */
    sendImage(imageFile: File) {
        return new Promise<string>((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('POST', this._postImageUrl, true);
            let formData = new FormData();

            formData.append('image', imageFile);
            request.onloadend = (() => {
                this.updateImageNamesInFolder_original();
                this.copyImageForEditing(request.responseText).catch(error => {
                    reject(error);
                });
                resolve(request.responseText);
            });

            request.send(formData);

        });

    }

    /**
    * Method that does a delete request for images that are located in the path: imageDir. 
     */
    deleteImage(imageName: string): Promise<string[]> {
        if (imageName !== "selectAll_Images.png") {
            let imageNames = this._editorService.imageNamesInFolder;
            if (imageNames.some(image => image === imageName)) {
                try {
                    const data = this._http.delete(this._deleteImageUrl + '/' + imageName).pipe(
                        map(this.extractData)).toPromise();
                    this.updateImageNamesInFolder();
                    return data;
                } catch (error) {
                    this.handleError(error)
                }
            }
        } else { return null }
    }

    /**
     * Method that does a request for moving a specific image from the image gallery
     * (path: imageDir_edited) back to the editing view (path: imageDir).
     */
    async  moveImageBackForEditing(imageName: string): Promise<string> {
        try {
            const data = await this._http.post(this._postMoveImage_Back + '/' + imageName, "").pipe(
                map(this.extractData)).
                toPromise();
            await this.updateImageNamesInFolder_edited();
            this.updateImageNamesInFolder();
            return data;

        } catch (error) {
            this.handleError(error);
        }


    }

    /**
     * Method that does a request for moving a specific image from the editing view
     * (path: imageDir) to the image gallery (path: imageDir_edited).
     */
    async moveImageToImageGallery(imageName: string): Promise<string> {
        try {
            if (imageName !== "selectAll_Images.png") {
            const data = this._http.post(this._postMoveImage_ToImageGallery + '/' + imageName, "").pipe(
                map(this.extractData)).toPromise();
            await this.updateImageNamesInFolder_edited();
            this.updateImageNamesInFolder();
            return data;
            }
        } catch (error) {
            this.handleError(error);
        }

    }

    /**
     * Method that does a request for moving a specific image from the image gallery 
     * (path: imageDir_edited) to the imagesComplete folder (path_ imageDir_complete).
     */
    async  moveImageToImagesComplete(imageName: string): Promise<string> {
        try {
            const data = await this._http.post(this._postMoveImage_ToImagesComplete + '/' + imageName, "").pipe(
                map(this.extractData)).toPromise();
            await this.updateImageNamesInFolder_edited();
            this.updateImageNamesInFolder_complete();
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Method that does a request for copying a specific image from the original images folder
     * (path: imageDir_original) to the editing view (path: imageDir_edited).
     */
    async copyImageForEditing(imageName: string): Promise<string> {
        try {
            const data = await this._http.post(this._postCopyImage_ForEditing + '/' + imageName, "").pipe(
                map(this.extractData)).toPromise();
            await this.updateImageNamesInFolder();
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Method that does multiple requests for copying images from the original images folder
     * (path: imageDir_original) to the editing view (path: imageDir_edited).
     */
    copyImagesForEditing(imageNames: string[]): Promise<number> {
        return new Promise((resolve) => {
            let count = 0;
            let finish = imageNames.length;
            for (let imageName of imageNames) {
                this.copyImageForEditing(imageName).then(() => {
                    count = this._editorService.countResolve(count, finish, resolve)
                });
            }
        });
    }
    /**
     * This method deletes all images that are declared
     * in the array and located in the images folder.
     */
    deleteAllImagesInImagesFolder(imageNames: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let count = 0;
            let finish = imageNames.length;
            for (let imageName of imageNames) {
                this.deleteImage(imageName).then(() => {
                    count = this._editorService.countResolve(count, finish, resolve);
                }, rejected => {
                    reject(rejected);
                });
            }
        });
    }
    /**
     * This method updates the names of the images that are placed 
     * in the folders: images, images_edited and images_original.
     * Then the editor service gets the updated list of names.
     */
    updateImageNamesOfAllFolders() {
        this.updateImageNamesInFolder();
        this.updateImageNamesInFolder_edited();
        this.updateImageNamesInFolder_original();
    }

    /** 
    * This method requests the names of the images that are placed 
    * in the images folder.
    * Then the editor service gets the updated list of names.
    */
    public async updateImageNamesInFolder() {
        try {
            const imageNames = await this.getImageNames()
            this._editorService.updateImageNamesInFolder(imageNames);
        } catch (error) {
            console.error(error);
        }
    }
    /** 
     * This method requests the names of the images that are placed 
     * in the images_original folder.
     * Then the editor service gets the updated list of names.
     */
    public async updateImageNamesInFolder_original() {
        try {
            const imageNames = await this.getImageNames_original();
            this._editorService.updateImageNamesInFolder_original(imageNames);
        } catch (error) {
            console.error(error);
        }
    }

    /** 
     * This method requests the names of the images that are placed 
     * in the images_edited folder.
     * Then the editor service gets the updated list of names.
     */
    public async updateImageNamesInFolder_edited() {
        try {
            const imageNames = await this.getImageNames_edited();
            this._editorService.updateImageNamesInFolder_edited(imageNames);
        } catch (error) {
            console.error(error);
        };
    }

    /** 
     * This method requests the names of the images that are placed 
     * in the images_complete folder.
     * Then the editor service gets the updated list of names.
     */
    public async updateImageNamesInFolder_complete() {
        try {
            const imageNames = await this.getImageNames_complete();
            this._editorService.updateImageNamesInFolder_complete(imageNames);
        } catch (error) {
            console.error(error);
        }
    }

    private extractData(res: any) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        return res.data || {};
    }
    private handleError(error: any) {
        let err = error.message || 'Server error';
        console.error(err);
    }
}