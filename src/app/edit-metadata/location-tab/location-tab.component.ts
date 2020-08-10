import { Component, OnInit, ChangeDetectorRef, EventEmitter, OnDestroy } from '@angular/core';
import { LatLongZoom } from 'app/types/latlongzoom.interface';
import { LatLong } from 'app/types/latlong.interface';
import { FormControl } from '@angular/forms';
import { MetadataService } from 'app/services/metadata.service';
import { Z_DATA_ERROR } from 'zlib';
import { MetadataFromLocationTab } from 'app/types/metadata-from-location-tab.interface';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';

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


    constructor(private _cdr: ChangeDetectorRef, private _metadataService: MetadataService, private _metadataFromImageService: MetadataFromImageService) {

    }

    ngOnDestroy(): void {
        let latitude;
        let longitude;
        let date: Date;

        date = new Date(this.dateImageCreated.value);
        let time = <Date>this.timeImageCreated.value;
        date.setHours(time.getHours());
        date.setMinutes(time.getMinutes());
        date.setSeconds(time.getSeconds());


        latitude = this.latitudeControl.value;
        longitude = this.longitudeControl.value;


        this._metadataService.updateLocation({
            longitude: longitude,
            latitude: latitude,
            dateAndTime: date,
            isTimeDisabled: this.isTimeDisabled,
            isLocationDisabled: this.isLocationDisabled
        });
    }
    ngOnInit() {
        let metadata: MetadataFromLocationTab = this._metadataService.location;
        if (typeof metadata === "undefined" || metadata === null) {
            metadata = this._metadataFromImageService.location;
        }

        if (typeof metadata !== "undefined" || metadata === null) {
            this.isTimeDisabled = metadata.isTimeDisabled;
            this.isLocationDisabled = metadata.isLocationDisabled;
            this.timeImageCreated.setValue(metadata.dateAndTime);
            this.dateImageCreated.setValue(metadata.dateAndTime);

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
            }
            this._cdr.detectChanges();
        }

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


    }

    onChangeTime(value) {


    }
}