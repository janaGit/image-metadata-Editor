import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataFromLocationTab } from '../types/metadata-from-location-tab.interface';
import { MetadataFromMetadataTab } from '../types/metadata-from-metadata-tab.interface';
import { ExifToolService } from './exif-tool.service';

/**
 * This service class stores all the metadata for the currently edited image.
 */
@Injectable()
export class MetadataFromImageService {
    private _metadata;

    private _editMetadata: MetadataFromMetadataTab;

    private __editMetadata: BehaviorSubject<MetadataFromMetadataTab> = new BehaviorSubject<MetadataFromMetadataTab>({creator:"",contactInfo:"",description:"",keywords:[],license:"",subject:""});

    public editMetadata$ = this.__editMetadata.asObservable();


    private _categories: string[];

    private __categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(["Animal", "Feciduous Forest", "Buildings", "Open Fields", "See", "Test", "Test2"]);

    public categories$ = this.__categories.asObservable();


    private _metadataKeys: string[];

    private __metadataKeys: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    public metadataKeys$ = this.__metadataKeys.asObservable();



    private _location: MetadataFromLocationTab;

    private __location: BehaviorSubject<MetadataFromLocationTab> = new BehaviorSubject<MetadataFromLocationTab>(null);

    public location$ = this.__categories.asObservable();




    constructor() {

    }

    set metadata(metadata) {
        this._metadata = metadata;
        this.setEditMetadata();
        this.setCategories();
        this.setLocation();
    }
    get editMetadata() {
        return this._editMetadata;
    }

    get categories() {
        return this._categories;
    }

    get metadataKeys() {
        return this._metadataKeys;
    }

    get location() {
        return this._location;
    }

    updateEditMetadata(metadata) {
        this._editMetadata = metadata;
        this.__editMetadata.next(metadata);
    }

    updateCategories(categories) {
        this._categories = categories;
        this.__categories.next(categories);
    }

    updateMetadataKeys(metadataKeys) {
        this._metadataKeys = metadataKeys;
        this.__metadataKeys.next(metadataKeys);
    }

    updateLocation(location: MetadataFromLocationTab) {
        this._location = location;
        this.__location.next(location);
    }

    setEditMetadata() {
        const editMetadata: MetadataFromMetadataTab = {
            creator: this._metadata["Creator"],
            contactInfo: this._metadata["ContactInfo"],
            license: this._metadata["License"],
            keywords: this._metadata["Keywords"],
            subject: this._metadata["Subject"],
            description: this._metadata["Description"]
        };
        this.updateEditMetadata(editMetadata);

    }

    setCategories() {
        if (this._metadata["Categories"]) {
            this.updateCategories(this._metadata["Categories"]);
        }

    }

    setLocation() {
        this.updateLocation({
            latitude: this._metadata["GPSLatitude"],
            longitude: this._metadata["GPSLongitude"],
            dateAndTime: this._metadata["DateTimeOriginal"]

        });
    }
}