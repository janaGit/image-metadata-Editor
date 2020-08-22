import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LatLongZoom } from 'app/types/latlongzoom.interface';
import { LatLong } from 'app/types/latlong.interface';
import { FormControl } from '@angular/forms';
import { EditTemplateService } from '../edit-template.service';
import { TemplateLocationTab } from 'app/types/template-location-tab.interface';

const SHOW_OSM_LAYER = "Show OSM Layer";
const HIDE_OSM_LAYER = "Hide OSM Layer";

const DEFAULT_LATITUDE = 52;
const DEFAULT_LONGITUDE = 11;

@Component({
    selector: 'app-location-template-tab',
    templateUrl: './location-template-tab.component.html',
    styleUrls: ['./location-template-tab.component.scss', '../../css/global-app.scss']
})
export class LocationTemplateTabComponent implements OnInit, OnDestroy {

    isLocationCopiedFromImage = false;
    isTimeCopiedFromImage = false;

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


    constructor(private _cdr: ChangeDetectorRef, private _editTemplateService: EditTemplateService) {

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


        this._editTemplateService.updateLocation({
            longitude: longitude,
            latitude: latitude,
            dateAndTime: date,
            isTimeDisabledByDefault: this.isTimeDisabled,
            isLocationCopiedFromImage: this.isLocationCopiedFromImage,
            isLocationDisabledByDefault: this.isLocationDisabled,
            isTimeCopiedFromImage: this.isTimeCopiedFromImage
        });
    }
    ngOnInit() {
        let metadata: TemplateLocationTab = this._editTemplateService.location;


        if (typeof metadata !== "undefined" || metadata === null) {
            this.isTimeDisabled = metadata.isTimeDisabledByDefault;
            this.isLocationDisabled = metadata.isLocationDisabledByDefault

            this.isLocationCopiedFromImage = metadata.isLocationCopiedFromImage;
            this.isTimeCopiedFromImage = metadata.isTimeCopiedFromImage;

            if (typeof metadata.latitude !== "undefined" && typeof metadata.longitude !== "undefined") {
                this.markerLatLong = {
                    lat: metadata.latitude,
                    long: metadata.longitude
                }
            }

            if (typeof metadata.dateAndTime === "undefined") {
                this.dateImageCreated.setValue(new Date());
                this.dateImageCreated.setValue(new Date());
            } else {
                this.dateImageCreated.setValue(metadata.dateAndTime);
                this.dateImageCreated.setValue(metadata.dateAndTime);
            }

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
