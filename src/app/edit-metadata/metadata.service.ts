import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataFromMetadataTab } from 'app/types/metadata-from-metadata-tab.interface';
import { MetadataFromLocationTab } from 'app/types/metadata-from-location-tab.interface';
import { MetadataFromCategoriesTab } from 'app/types/metadata-from-categories-tab.interface';
import { map } from 'rxjs/operators';
import { ReturnObject } from 'app/types/return-object.interface';
import { HttpClient } from '@angular/common/http';
import { EditorService } from '../services/editor.service';

/**
 * This service class stores all the metadata for the currently edited image.
 */
@Injectable()
export class MetadataService {
    private _serverBase = '/api';

    private _uri_editMetadata = this._serverBase + '/editMetadata';

    private _editMetadata: MetadataFromMetadataTab;

    private __editMetadata: BehaviorSubject<MetadataFromMetadataTab> = new BehaviorSubject<MetadataFromMetadataTab>(null);

    public editMetadata$ = this.__editMetadata.asObservable();


    private _categories: MetadataFromCategoriesTab;

    private __categories: BehaviorSubject<MetadataFromCategoriesTab> = new BehaviorSubject<MetadataFromCategoriesTab>(null);

    public categories$ = this.__categories.asObservable();


    private _existingMetadata: Map<string, string> = new Map();

    private __existingMetadata: BehaviorSubject<Map<string, string>> = new BehaviorSubject<Map<string, string>>(new Map());

    public existingMetadata$ = this.__existingMetadata.asObservable();



    private _location: MetadataFromLocationTab;

    private __location: BehaviorSubject<MetadataFromLocationTab> = new BehaviorSubject<MetadataFromLocationTab>(null);

    public location$ = this.__categories.asObservable();




    constructor(private _http: HttpClient, private _editorService: EditorService) {
    }

    get editMetadata() {
        return this._editMetadata;
    }

    get categories() {
        return this._categories;
    }

    get existingMetadata() {
        return this._existingMetadata;
    }

    get location() {
        return this._location;
    }

    updateEditMetadata(metadata: MetadataFromMetadataTab) {
        this._editMetadata = metadata;
        this.__editMetadata.next(metadata);
    }

    updateCategories(categories: MetadataFromCategoriesTab) {
        this._categories = categories;
        this.__categories.next(categories);
    }

    updateExistingMetadata(existingMetadata: Map<string, string>) {
        this._existingMetadata = existingMetadata;
        this.__existingMetadata.next(existingMetadata);
    }

    updateLocation(location: MetadataFromLocationTab) {
        this._location = location;
        this.__location.next(location);
    }

    resetMetadata() {
        this.updateExistingMetadata(new Map());
        this.updateEditMetadata(null);
        this.updateCategories(null);
        this.updateLocation(null);
    }

    getAllMetadata(): Object {
        const allMetadata: Object = {};
        if (this.editMetadata) {
            for (const key of Object.keys(this.editMetadata)) {
                if (this.editMetadata[key] !== "" && typeof this.editMetadata[key] !== "undefined") {
                    allMetadata[key] = this.editMetadata[key];
                }
            }
        }

        this.existingMetadata.forEach((value, key) => {
            allMetadata[key] = value;
        })

        if (this.categories && this.categories.categories) {
            allMetadata["Categories"] = this.categories.categories.toString();
        }

        if (this.location) {
            if (typeof this.location.latitude !== "undefined" && !this.location.isLocationDisabled) {
                allMetadata["GPSLatitude"] = this.location.latitude;
            }
            if (typeof this.location.longitude !== "undefined" && !this.location.isLocationDisabled) {
                allMetadata["GPSLongitude"] = this.location.longitude;
            }
            if (typeof this.location.dateAndTime !== "undefined" && !this.location.isTimeDisabled) {
                allMetadata["DateTimeOriginal"] = this.location.dateAndTime;
            }

        }
        return allMetadata;
    }


    async sendMetadataToBackend() {
        try {
            const returnObject = await this._http.post(this._uri_editMetadata + '/' + this._editorService.imageName, { metadata: this.getAllMetadata() }).pipe(
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