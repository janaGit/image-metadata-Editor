import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * This service class stores all the data that are created during the 
 * use of the editor. 
 */
@Injectable()
export class EditorService {
    
    /**
     * Variable that stores a BehaviorSubject to distribute the 
     * name of the actual image of the editing view to the registered subscribers.
     */
    private __imageName: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

    /**
     * Variable that stores a BehaviorSubject to distribute the 
     * name of the actual image of the image gallery to the registered subscribers.
     */
    private __imageName_edited: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
   /**
    * Variable that stores the actual image name for the editing view.
    */
    private _imageName: string;

   /**
    * Variable that stores the actual image name for the image gallery.
    */
    private _imageName_edited: string;

   /**
    * Variable to subscribe to the Observable to get
    * the actual image name of the editing view.
    */
   public imageName$ = this.__imageName.asObservable();

   /**
    * Variable to subscribe to the Observable to get
    * the actual image name of the image gallery.
    */
   public imageName_edited$ = this.__imageName_edited.asObservable();

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
}