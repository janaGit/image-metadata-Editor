import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * This service class stores all the metadata for the currently edited image.
 */
@Injectable()
export class MetadataService {


    private _categories: string[];

    private __categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(["Animal","Feciduous Forest", "Buildings", "Open Fields", "See", "Test","Test2"]);

    public categories$ = this.__categories.asObservable();


    

    constructor() {
    }

    get categories() {
        return this._categories;
    }

    
    updateCategories(categories) {
        this._categories = categories;
        this.__categories.next(categories);
    }
}