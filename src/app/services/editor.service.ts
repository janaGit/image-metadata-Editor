import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ImageService } from './image.service';
import * as prefix from '../../../utilities/image-prefixes';


/**
 * This service class stores all the data that are created during the 
 * use of the editor. 
 */
@Injectable()
export class EditorService {

    /**  imageName            ---------------------------------------------           */
    /**
     * Variable that stores the actual image name for the editing view.
     */
    private _imageName: string;

    /**
     * Variable that stores a BehaviorSubject to distribute the 
     * name of the actual image of the editing view to the registered subscribers.
     */
    private __imageName: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
    /**
     * Variable to subscribe to the Observable to get
     * the actual image name of the editing view.
     */
    public imageName$ = this.__imageName.asObservable();


    /**  imageName_edited            ---------------------------------------------           */

    /**
     * Variable that stores the actual image name for the image gallery.
     */
    private _imageName_edited: string;

    /**
     * Variable that stores a BehaviorSubject to distribute the 
     * name of the actual image of the image gallery to the registered subscribers.
     */
    private __imageName_edited: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
    /**
     * Variable to subscribe to the Observable to get
     * the actual image name of the image gallery.
     */
    public imageName_edited$ = this.__imageName_edited.asObservable();


    /**  File-Tab----------------------------------  */
    /**
     * This variable stores the information if the FileTab is shown (true) or not (false).
     */
    private _fileTabOpen: boolean;
    /**
     * Variable that stores a BehaviorSubject to distribute if the file-Tab is actually open or not.
     */
    private __fileTabOpen: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
    /**
     * variable to subscribe, if the file tab is open or not.
     */
    public _fileTabOpen$ = this.__fileTabOpen.asObservable();


    /**  image name in images folder     ---------------------------------------------   */
    /**
     * Variable that stores a BehaviorSubject to distribute the 
     * names of the images in the images folder.
     */
    private __imageNamesInFolder: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);

    /**
     * This variable stores the names of the images in the images folder.
     */
    private _imageNamesInFolder: string[];
    /**
     *  Variable to subscribe to the Observable to get
     * the actual image name of the image gallery.
     */
    public _imageNamesInFolder$ = this.__imageNamesInFolder.asObservable();

    /**  image name in images_edited folder     ---------------------------------------------   */
    /**
     * Variable that stores a BehaviorSubject to distribute the 
     * names of the images in the images_edited folder.
     */
    private __imageNamesInFolder_edited: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);

    /**
     * This variable stores the names of the images in the images_edited folder.
     */
    private _imageNamesInFolder_edited: string[];
    /**
     *  Variable to subscribe to the Observable to get
     * the actual image names of the image_edited gallery.
     */
    public _imageNamesInFolder_edited$ = this.__imageNamesInFolder_edited.asObservable();


    /**  image name in images_original folder     ---------------------------------------------   */
    /**
     * Variable that stores a BehaviorSubject to distribute the 
     * names of the images in the images_original folder.
     */
    private __imageNamesInFolder_original: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);

    /**
     * This variable stores the names of the images in the images_original folder.
     */
    private _imageNamesInFolder_original: string[];
    /**
     *  Variable to subscribe to the Observable to get
     * the actual image names of the image_original folder.
     */
    public _imageNamesInFolder_original$ = this.__imageNamesInFolder_original.asObservable();


    /** Image names in images_complete folder ---------------------------------------------------------- */
    /**
     * Variable that stores a BehaviorSubject to distribute the
     * names of the images in the images_complete folder.
     */
    private __imageNamesInFolder_complete: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);
    /**
     * This variable stores the names of the images in the images_complete folder.
     */
    private _imageNamesInFolder_complete: string[];
    /**
     * Variable to subscribe to the Observable to get the actual image names of the images_complete folder.
     */
    public _imageNamesInFolder_complete$ = this.__imageNamesInFolder_complete.asObservable();



    /**
     * This variable stores an error message that was returned
     * by the image service.
     */
    private _errorMessage_imageService: string;


    constructor() {
    }
    /**
     * Get the image name of the actual selected image of the editing view.
     */
    get imageName() {
        return this._imageName;
    }

    /**
     * Get the image name of the actual selected image of the image gallery.
     */
    get imageName_edited() {
        return this._imageName_edited;
    }

    /**
     * Get the variable that stores the information 
     * if the FileTab is shown (true) or not (false).
     */
    get fileTabOpen(): boolean {
        return this._fileTabOpen;
    }
    /**
     *  Set the variable that stores the information 
     * if the FileTab is shown (true) or not (false).
     */
    set fileTabOpen(isOpen: boolean) {
        this._fileTabOpen = isOpen;
    }
    /**
     * Get the image names of the images in the images_original folder.
     */
    get imageNamesInFolder_original() {
        return this._imageNamesInFolder_original;
    }
    /**
     * Get the image names of the images in the images_edited folder.
     */
    get imageNamesInFolder_edited() {
        return this._imageNamesInFolder_edited;
    }
    /**
     * Get the image names of the images in the images_complete folder.
     */
    get imageNamesInFolder_complete() {
        return this._imageNamesInFolder_complete;
    }
    /**
     * Get the image names of the images in the images folder.
     */
    get imageNamesInFolder() {
        return this._imageNamesInFolder;
    }

    /**
     * Method sets the name of the actual selected image of the 
     * editing view and pushes the update to all subscribers 
     * of imageName$.
     */
    updateImageName(imgName) {
        this._imageName = imgName;
        this.__imageName.next(imgName);
    }

    /**
     * Method sets the name of the actual selected image of the 
     * image gallery and pushes the update to all subscribers 
     * of imageName_edited$.
     */
    updateImageName_edited(imgName_edited) {
        this._imageName_edited = imgName_edited;
        this.__imageName_edited.next(imgName_edited);
    }
    /**
     * This method gets an actual list of names of the images 
     * in the images_edited folder.
     * The actual list is then send to all the subscribers of 
     * imageNamesInFolder_edited$
     */
    updateImageNamesInFolder_edited(imageNames: string[]) {
        this._imageNamesInFolder_edited = imageNames;
        this.__imageNamesInFolder_edited.next(imageNames);
    }
    /**
     * This method gets an actual list of names of the images
     * in the images_original folder.
     * The actual list is then send to all the subscribers of 
     * imageNamesInFolder_original$
     */
    updateImageNamesInFolder_original(imageNames: string[]) {
        this._imageNamesInFolder_original = imageNames;
        this.__imageNamesInFolder_original.next(imageNames);
    }
    /**
     * This method gets an actual list of names of the images
     * in the images_complete folder.
     * The actual list is then send to all the subscribers of 
     * imageNamesInFolder_original$
     */
    updateImageNamesInFolder_complete(imageNames: string[]) {
        this._imageNamesInFolder_complete = imageNames;
        this.__imageNamesInFolder_complete.next(imageNames);
    }
    /**
    * This method gets an actual list of names of the images
    * in the images folder.
    * The actual list is then send to all the subscribers of 
    * imageNamesInFolder$
    */
    updateImageNamesInFolder(imageNames: string[]) {
        this._imageNamesInFolder = imageNames;
        this.__imageNamesInFolder.next(imageNames);
    }
    /**
     * This method updates the status if the fileTab is open or not
     * and send the status to all subscribers
     */
    updateIsFileTabOpen(isOpen: boolean) {
        this._fileTabOpen = isOpen;
        this.__fileTabOpen.next(isOpen);
    }


    /**
     * This method checks if all tasked have been resolved.
     * Therefore it takes the actual counter, the number of the tasks and method:resolve().
     * If all task have been resolved, then the resolve()-method is executed.
     * If not, then the actualized counter is returned.
     */
    public countResolve(counter: number, finish: number, resolve): number {
        counter = counter + 1;
        if (counter === finish) {
            resolve(true);
        }
        return counter;
    }
    /**
     * This method returns all strings of an array that contain a specific substring.
     */
    /*     public returnArrayElementsWithSubstring(array: string[], substring: string): string[] {
            let results = new Array<string>();
            if (array) {
                results = array.filter((element) => {
                    return element.indexOf(substring) > -1;
                });
            }
            return results;
        } */
}