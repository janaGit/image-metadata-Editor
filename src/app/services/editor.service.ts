import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateExistingMetadata } from "../types/template-existing-metadata.interface";
import { AppTemplate } from "../types/app-template.interface";
import { map } from 'rxjs/operators';
import { emptyTemplate, IMAGE_COPY_TEMPLATE, imageCopyTemplate, EMPTY_TEMPLATE } from "../templates"
import { extractData, handleError } from '../../../utilities/utilitiy-methods';
import { REST_GET_TEMPLATES, REST_GET_CATEGORY_TREE, REST_DELETE_TEMPLATE, REST_WRITE_TEMPLATE, REST_GET_CONFIG } from '../../../utilities/constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgModuleResolver } from '@angular/compiler';
import { ExistingMetadataTemplateMethods } from 'app/types/existing-metadata-templete-methods.type';
import { AppConfig } from 'app/types/app-config.interface';


/**
 * This service class stores all the data that are created during the 
 * use of the editor. 
 */
@Injectable()
export class EditorService {
    editableKeys: string[] = ["creator", "categories", "description", "subject", "keywords",
        "license", "contactinfo", "gpslatitude", "gpslongitude", "gpsposition", "datetimeoriginal"];
    importantMetadataKeys: string;

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
    private _startTabOpen: boolean;
    /**
     * Variable that stores a BehaviorSubject to distribute if the file-Tab is actually open or not.
     */
    private __startTabOpen: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
    /**
     * variable to subscribe, if the file tab is open or not.
     */
    public _startTabOpen$ = this.__startTabOpen.asObservable();


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
    private __imageNamesInFolder_edited: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

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



    /**  license names            ---------------------------------------------           */
    /**
     * Variable that stores the license names.
     */
    private _license_names: string[];

    /**
     * Variable that stores a BehaviorSubject to distribute the 
     * license names to the registered subscribers.
     */
    private __license_names: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    /**
     * Variable to subscribe to the Observable to get
     * the license names.
     */
    public license_names$ = this.__license_names.asObservable();



    /**  templates       ---------------------------------------------           */

    private _templates: Map<string, AppTemplate> = new Map();


    private __templates: BehaviorSubject<Map<string, AppTemplate>> = new BehaviorSubject<Map<string, AppTemplate>>(new Map());


    public templates$ = this.__templates.asObservable();

    /**  category tree           ---------------------------------------------           */

    private _categoryTree: Object = {};


    private __categoryTree: BehaviorSubject<Object> = new BehaviorSubject<Object>({});

    public categoryTree$ = this.__categoryTree.asObservable();


    /**  config           ---------------------------------------------           */

    private _config: AppConfig;


    private __config: BehaviorSubject<AppConfig> = new BehaviorSubject<AppConfig>(undefined);

    public config$ = this.__config.asObservable();


    /** Post counter value for modal Progress  ---------------------------------------------------------- */
    /**
     * Variable that stores a BehaviorSubject to distribute the
     * status of the progress.
     */
    private __progress_value: BehaviorSubject<{ value: number, max: number, title: string }> = new BehaviorSubject(undefined);
    /**
     * Variable to subscribe to the Observable to get the current value for the progress.
     */
    public _progress_value$ = this.__progress_value.asObservable();

    /**
     * This variable stores an error message that was returned
     * by the image service.
     */
    private _errorMessage_imageService: string;


    constructor(private _http: HttpClient, private _router: Router) {
        this.getTemplatesFromBackend();
        this.getCategoryTreeFromBackend();
        this.getConfigFromBackend();
    }

    async getTemplatesFromBackend() {
        try {
            const templates: AppTemplate[] = await this._http.get(REST_GET_TEMPLATES).pipe(
                map(extractData)).toPromise();

            const templateMap: Map<string, AppTemplate> = new Map();

            for (let template of templates) {
                templateMap.set(template.name, template)
            }
            templateMap.set(EMPTY_TEMPLATE, emptyTemplate);
            templateMap.set(IMAGE_COPY_TEMPLATE, imageCopyTemplate);
            this.updateTemplates(templateMap);
        } catch (error) {
            handleError(error);
        }
    }
    private async getCategoryTreeFromBackend() {
        try {
            const categoryTree = await this._http.get(REST_GET_CATEGORY_TREE).pipe(
                map(extractData)).toPromise();
            this.updateCategoryTree(categoryTree);
        } catch (error) {
            handleError(error);
        }
    }

    private async getConfigFromBackend() {
        try {
            const config = await this._http.get(REST_GET_CONFIG).pipe(
                map(extractData)).toPromise();
            this.updateConfig(config);
        
        } catch (error) {
            handleError(error);
        }
    }

    getSupportedCategories(): string[] {
        let categories = [];

        for (let category of Object.keys(this.categoryTree)) {
            if (this.categoryTree[category] !== null) {
                categories = [...categories, category, ...this.getCategories(this.categoryTree[category], [])];
            } else {
                categories = [...categories, category];
            }
        }


        return categories;

    }

    getCategories(tree: {}, nodes: string[]): string[] {
        for (let key of Object.keys(tree)) {
            if (tree[key] !== null) {
                return this.getCategories(tree[key], [...nodes, key]);
            } else {
                return [...nodes, key]
            }

        }
    }

    async deleteTemplateBackend(template: AppTemplate) {
        try {
            await this._http.delete(REST_DELETE_TEMPLATE + "/" + template.name.replace(" ", "")).toPromise();
            await this.getTemplatesFromBackend();
        } catch (error) {
            handleError(error);
        }
    }

    async writeTemplateBackend(template: AppTemplate) {
        try {
            await this._http.post(REST_WRITE_TEMPLATE, { template: template }).toPromise();
        } catch (error) {
            handleError(error);
        }
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
    get startTabOpen(): boolean {
        return this._startTabOpen;
    }
    /**
     *  Set the variable that stores the information 
     * if the FileTab is shown (true) or not (false).
     */
    set startTabOpen(isOpen: boolean) {
        this._startTabOpen = isOpen;
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
     * Get the license names.
     */
    get getLicenseNames() {
        return this._license_names;
    }


    get categoryTree() {
        return this._categoryTree;
    }

    get config() {
        return this._config;
    }
    /**
     * Get the templates for the more-metadata tab.
     */
    get templates() {
        return this._templates;
    }

    /**
     * Get the current value of the progress for the progressbar.
     */
    get progressValue() {
        return this.__progress_value;
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
        this._startTabOpen = isOpen;
        this.__startTabOpen.next(isOpen);
    }

    /**
     * This method updates the license names.
     */
    updateLicenseNames(licenseNames: string[]) {
        this._license_names = licenseNames;
        this.__license_names.next(licenseNames);
    }

    /**
     * This method updates the templates for the more-metadata tab
     */
    updateCategoryTree(categoryTree: Object) {
        this._categoryTree = categoryTree;
        this.__categoryTree.next(categoryTree);
    }


    updateConfig(config: AppConfig) {
        config.importantMetadataKeys = config.importantMetadataKeys.map(value=>value.toLocaleLowerCase())
        this._config = config;
        this.__config.next(config);
        this.updateLicenseNames(config.licenses);
    }

    /**
     * This method updates the templates
     */
    updateTemplates(templates: Map<string, AppTemplate>) {
        this._templates = templates;
        this.__templates.next(templates);
    }
    /**
 * This method updates the value of the current progress for the progressbar
 */
    updateValueProgress(value: number, max: number, title: string) {
        this.__progress_value.next({ value, max, title });
    }

    /**
     * This method checks if all tasked have been resolved.
     * Therefore it takes the actual counter, the number of the tasks and method:resolve().
     * If all task have been resolved, then the resolve()-method is executed.
     * If not, then the actualized counter is returned.
     */
    public countResolve(counter: number, finish: number, title: string, resolve): number {
        counter = counter + 1;
        this.updateValueProgress(counter, finish, title);
        if (counter === finish) {
            resolve(true);
        }
        return counter;
    }

    public isEditableKey(key: string): boolean {
        return this.editableKeys.indexOf(key.toLocaleLowerCase()) > -1;
    }
    public isImportantMetadataKey(key: string): boolean {
        return this.config && this.config.importantMetadataKeys.indexOf(key.toLocaleLowerCase()) > -1;
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