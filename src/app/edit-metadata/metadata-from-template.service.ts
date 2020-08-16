import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataFromMetadataTab } from '../types/metadata-from-metadata-tab.interface';
import { MetadataFromLocationTab } from '../types/metadata-from-location-tab.interface';

@Injectable({
  providedIn: 'root'
})
export class MetadataFromTemplateService {

  private _editMetadata: MetadataFromMetadataTab;

  private __editMetadata: BehaviorSubject<MetadataFromMetadataTab> = new BehaviorSubject<MetadataFromMetadataTab>(null);

  public editMetadata$ = this.__editMetadata.asObservable();


  private _categories: string[];

  private __categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(["Animal","Feciduous Forest", "Buildings", "Open Fields", "See", "Test","Test2"]);

  public categories$ = this.__categories.asObservable();


  private _metadataKeys: string[];

  private __metadataKeys: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  public metadataKeys$ = this.__metadataKeys.asObservable();



  private _location: MetadataFromLocationTab;

  private __location: BehaviorSubject<MetadataFromLocationTab> = new BehaviorSubject<MetadataFromLocationTab>(null);

  public location$ = this.__categories.asObservable();


  

  constructor() {
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

  updateLocation(location) {
      this._location = location;
      this.__location.next(location);
  }
}
