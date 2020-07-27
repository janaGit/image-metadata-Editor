import { Component, OnInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { LatLongZoom } from 'app/types/latlongzoom.interface';
import { LatLong } from 'app/types/latlong.interface';
import { FormControl } from '@angular/forms';

const SHOW_OSM_LAYER = "Show OSM Layer";
const HIDE_OSM_LAYER = "Hide OSM Layer";

const BUTTON_TITLE_TOGGLE_DISABLE_LOCATION = "Disable Location";
const BUTTON_TITLE_TOGGLE_ENABLE_LOCATION = "Enable Location";

const DEFAULT_LATITUDE = 52;
const DEFAULT_LONGITUDE = 11;
@Component({
    selector: 'location-tab',
    templateUrl: 'location-tab.component.html',
    styleUrls: ['location-tab.component.css', '../../css/global-app.css']
})

export class LocationTabComponent implements OnInit {
    latitudeControl = new FormControl(DEFAULT_LATITUDE);
    longitudeControl = new FormControl(DEFAULT_LONGITUDE);

    latLongZoom: LatLongZoom = { lat: DEFAULT_LATITUDE, long: DEFAULT_LONGITUDE, zoomLevel: 6 }

    private _markerLatLong: LatLong = { lat: DEFAULT_LATITUDE, long: DEFAULT_LONGITUDE };

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


    areLayersRequested = false;
    isLocationDisabled= false;
    buttonShowOSMLayerTitle = SHOW_OSM_LAYER;
    buttonToggleEnableDisableLocation = BUTTON_TITLE_TOGGLE_DISABLE_LOCATION;
    constructor(private _cdr: ChangeDetectorRef) {

    }

    ngOnInit() {

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
        this.isLocationDisabled = !this.isLocationDisabled;
        if (this.buttonToggleEnableDisableLocation === BUTTON_TITLE_TOGGLE_DISABLE_LOCATION) {
            this.buttonToggleEnableDisableLocation = BUTTON_TITLE_TOGGLE_ENABLE_LOCATION;
            this.latitudeControl.disable();
            this.longitudeControl.disable();
        } else {
            this.buttonToggleEnableDisableLocation = BUTTON_TITLE_TOGGLE_DISABLE_LOCATION;
            this.latitudeControl.enable();
            this.longitudeControl.enable();
        }
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
}