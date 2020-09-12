import { Component, OnInit, ChangeDetectorRef, EventEmitter, OnDestroy } from '@angular/core';
import { LatLongZoom } from 'app/types/latlongzoom.interface';
import { LatLong } from 'app/types/latlong.interface';
import { FormControl } from '@angular/forms';
import { MetadataService } from '../metadata.service';
import { Z_DATA_ERROR } from 'zlib';
import { MetadataFromLocationTab } from 'app/types/metadata-from-location-tab.interface';
import { MetadataFromImageService } from 'app/edit-metadata/metadata-from-image.service';
import { MetadataFromTemplateService } from '../metadata-from-template.service';
import { TemplateLocationTab } from 'app/types/template-location-tab.interface';

const SHOW_OSM_LAYER = "Show OSM Layer";
const HIDE_OSM_LAYER = "Hide OSM Layer";

const BUTTON_TITLE_TOGGLE_DISABLE_LOCATION = "Disable Location";
const BUTTON_TITLE_TOGGLE_ENABLE_LOCATION = "Enable Location";

const BUTTON_TITLE_TOGGLE_DISABLE_TIME = "Disable Time";
const BUTTON_TITLE_TOGGLE_ENABLE_TIME = "Enable Time";

const DEFAULT_LATITUDE = 52;
const DEFAULT_LONGITUDE = 11;
@Component({
    selector: 'location-tab',
    templateUrl: 'location-tab.component.html',
    styleUrls: ['location-tab.component.scss', '../../css/global-app.scss']
})

export class LocationTabComponent implements OnInit, OnDestroy {
    latitudeControl = new FormControl(DEFAULT_LATITUDE);
    longitudeControl = new FormControl(DEFAULT_LONGITUDE);

    dateImageCreated = new FormControl(new Date());
    timeImageCreated = new FormControl(new Date());

    latLongZoom: LatLongZoom = { lat: DEFAULT_LATITUDE, long: DEFAULT_LONGITUDE, zoomLevel: 6 }

    private _markerLatLong: LatLong = { lat: DEFAULT_LATITUDE, long: DEFAULT_LONGITUDE };
    areLayersRequested = false;
    isLocationDisabled = false;
    isTimeDisabled = false;
    buttonShowOSMLayerTitle = SHOW_OSM_LAYER;
    buttonToggleEnableDisableLocation = BUTTON_TITLE_TOGGLE_DISABLE_LOCATION;
    buttonToggleEnableDisableTime = BUTTON_TITLE_TOGGLE_DISABLE_TIME;

    metadataFromImage: MetadataFromLocationTab;
    metadataFromTemplate: TemplateLocationTab;

    editedDateAndTime: string = "";

    dateFromTemplate: string;
    dateFromImage: string;
    constructor(private _cdr: ChangeDetectorRef,
        private _metadataService: MetadataService,
        private _metadataFromImageService: MetadataFromImageService,
        private _metadataFromTemplateService: MetadataFromTemplateService) {

    }

    ngOnDestroy(): void {
        let latitude;
        let longitude

        latitude = this.latitudeControl.value;
        longitude = this.longitudeControl.value;


        this._metadataService.updateLocation({
            longitude: longitude,
            latitude: latitude,
            dateAndTime: new Date(this.editedDateAndTime),
            isTimeDisabled: this.isTimeDisabled,
            isLocationDisabled: this.isLocationDisabled
        });
    }

    private setEditedDateAndTime() {
        let _date: Date;
        _date = new Date(this.dateImageCreated.value);
        let time = <Date>this.timeImageCreated.value;
        _date.setHours(time.getHours());
        _date.setMinutes(time.getMinutes());
        _date.setSeconds(time.getSeconds());

        this.editedDateAndTime = _date.toString();
    }

    ngOnInit() {
        let metadata: MetadataFromLocationTab = this._metadataService.location;

        this.metadataFromImage = this._metadataFromImageService.location;
        this.metadataFromTemplate = this._metadataFromTemplateService.location;

        this.dateFromImage = this.metadataFromImage.dateAndTime ? this.metadataFromImage.dateAndTime.toString() : "";
        this.dateFromTemplate = this.metadataFromTemplate.dateAndTime ? this.metadataFromTemplate.dateAndTime.toString() : "";

        this.isTimeDisabled = metadata.isTimeDisabled;
        this.isLocationDisabled = metadata.isLocationDisabled
        if (this.isTimeDisabled) {
            this.disableTime();
        }
        if (this.isLocationDisabled) {
            this.disableLocation();
        }

        if (typeof metadata.latitude !== "undefined" && typeof metadata.longitude !== "undefined") {
            this.markerLatLong = {
                lat: metadata.latitude,
                long: metadata.longitude
            }
        } else {
            this.disableLocation();
        }

        if (typeof metadata.dateAndTime === "undefined") {
            this.disableTime();
            this.dateImageCreated.setValue(new Date());
            this.timeImageCreated.setValue(new Date());
        } else {
            this.dateImageCreated.setValue(new Date(metadata.dateAndTime));
            this.timeImageCreated.setValue(new Date(metadata.dateAndTime));
        }


        this.setEditedDateAndTime();

    }

    set markerLatLong(markerLatLng: LatLong) {
        if (typeof markerLatLng.lat !== "undefined" && typeof markerLatLng.long !== "undefined") {
            this._markerLatLong = markerLatLng;
            this.latitudeControl.setValue(markerLatLng.lat);
            this.longitudeControl.setValue(markerLatLng.long);
        }
    }

    get markerLatLong(): LatLong {
        return this._markerLatLong;
    }

    toogleLayerView() {
        this.areLayersRequested = !this.areLayersRequested;
        if (this.buttonShowOSMLayerTitle === SHOW_OSM_LAYER) {
            this.buttonShowOSMLayerTitle = HIDE_OSM_LAYER;
        } else {
            this.buttonShowOSMLayerTitle = SHOW_OSM_LAYER;
        }
    }

    toogleEnableDisableLocation() {
        if (this.isLocationDisabled) {
            this.enableLocation();
        } else {
            this.disableLocation();
        }
    }
    disableLocation() {
        this.isLocationDisabled = true;
        this.buttonToggleEnableDisableLocation = BUTTON_TITLE_TOGGLE_ENABLE_LOCATION;
        this.latitudeControl.disable();
        this.longitudeControl.disable();
    }
    enableLocation() {
        this.isLocationDisabled = false;
        this.buttonToggleEnableDisableLocation = BUTTON_TITLE_TOGGLE_DISABLE_LOCATION;
        this.latitudeControl.enable();
        this.longitudeControl.enable();
    }

    toogleEnableDisableTime() {
        if (this.isTimeDisabled) {
            this.enableTime();
        } else {
            this.disableTime();
        }
    }

    disableTime() {
        this.isTimeDisabled = true;
        this.buttonToggleEnableDisableTime = BUTTON_TITLE_TOGGLE_ENABLE_TIME;
        this.dateImageCreated.disable();
        this.timeImageCreated.disable();
    }
    enableTime() {
        this.isTimeDisabled = false;
        this.buttonToggleEnableDisableTime = BUTTON_TITLE_TOGGLE_DISABLE_TIME;
        this.dateImageCreated.enable();
        this.timeImageCreated.enable();
    }

    onChangeLatitude(value) {
        if (value !== this.markerLatLong.lat) {
            this.markerLatLong = { lat: value, long: this.markerLatLong.long };
        }


    }
    onChangeLongitude(value) {
        if (value !== this.markerLatLong.long) {
            this.markerLatLong = { lat: this.markerLatLong.lat, long: value };
        }

    }
    onChangeDate(value) {
        this.setEditedDateAndTime();
    }

    onChangeTime(value) {
        this.setEditedDateAndTime();
    }

    coordinatesToString(latitude: number, longitude: number): string {
        if (typeof latitude === "undefined" || typeof latitude === "undefined") {
            return "";
        }
        return latitude.toFixed(4) + "  " + longitude.toFixed(4);
    }

    getLocationFromTemplate() {
        this.markerLatLong = {
            lat: this._metadataFromTemplateService.location.latitude,
            long: this._metadataFromTemplateService.location.longitude,
        }
    }
    getLocationFromImage() {
        this.markerLatLong = {
            lat: this._metadataFromImageService.location.latitude,
            long: this._metadataFromImageService.location.longitude,
        }
    }

    getTimeFromTemplate() {
        this.dateImageCreated.setValue(this.metadataFromTemplate.dateAndTime);
        this.timeImageCreated.setValue(this.metadataFromTemplate.dateAndTime);
    }
    getTimeFromImage() {
        this.dateImageCreated.setValue(this.metadataFromImage.dateAndTime);
        this.timeImageCreated.setValue(this.metadataFromImage.dateAndTime);
    }
}