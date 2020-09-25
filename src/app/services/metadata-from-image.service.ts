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

    private __editMetadata: BehaviorSubject<MetadataFromMetadataTab> = new BehaviorSubject<MetadataFromMetadataTab>({ creator: "", contactInfo: "", description: "", keywords: [], license: "", subject: "" });

    public editMetadata$ = this.__editMetadata.asObservable();


    private _categories: string[];

    private __categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    public categories$ = this.__categories.asObservable();


    private _existingMetadata: Map<string, string> = new Map();

    private __existingMetadata: BehaviorSubject<Map<string, string>> = new BehaviorSubject<Map<string, string>>(new Map());

    public existingMetadata$ = this.__existingMetadata.asObservable();



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
        this.setExistingMetadata();
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

    updateEditMetadata(metadata) {
        this._editMetadata = metadata;
        this.__editMetadata.next(metadata);
    }

    updateCategories(categories: string[]) {
        this._categories = categories;
        this.__categories.next(this._categories);
    }

    updateExistingMetadata(existingMetadata: Map<string, string>) {
        this._existingMetadata = existingMetadata;
        this.__existingMetadata.next(existingMetadata);
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
            keywords:  [].concat(this._metadata["Keywords"]),
            subject: this._metadata["Subject"],
            description: this._metadata["Description"]
        };
        this._editMetadata = editMetadata;
        this.updateEditMetadata(editMetadata);

    }

    setCategories() {
        if (this._metadata["Categories"]) {
            this._categories = this._metadata["Categories"].split(",")
            this.updateCategories(this._categories);
        }

    }
    setExistingMetadata() {
        const keys = Object.keys(this._metadata);
        keys.forEach(key => {
            this._existingMetadata.set(key, this._metadata[key]);
        })
        this.updateExistingMetadata(this._existingMetadata);
    }

    setLocation() {
        let date = this._metadata["DateTimeOriginal"];
        if (typeof date !== "undefined") {
            date = this.trandsormDate(date);
        }
        this._location = {
            latitude: +this._metadata["GPSLatitude"],
            longitude: +this._metadata["GPSLongitude"],
            dateAndTime: date,
            isLocationDisabled: false,
            isTimeDisabled: false
        };

        this.updateLocation(this._location);
    }
    trandsormDate(dateString: string): Date {
        const splitted = dateString.split(" ");
        if (splitted.length !== 2) {
            throw new Error("splitted has not the right length")
        }
        const _date = new Date();
        const date = splitted[0];
        const time = splitted[1];
        const dateSplitted = date.split(":");
        const timeSplitted = time.split(":");
        _date.setFullYear(+dateSplitted[0]);
        _date.setMonth(+dateSplitted[1]);
        _date.setDate(+dateSplitted[2]);
        _date.setHours(+timeSplitted[0]);
        _date.setMinutes(+timeSplitted[1]);
        _date.setSeconds(+timeSplitted[2])

        return _date;


    }

    resetMetadata(){
        this.updateExistingMetadata(new Map());
        this.updateEditMetadata(null);
        this.updateCategories(null);
        this.updateLocation(null);
    }
}