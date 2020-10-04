import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LatLongZoom } from 'app/types/latlongzoom.interface';
import { LatLong } from 'app/types/latlong.interface';
import { FormControl } from '@angular/forms';
import { EditAllMetadataService } from '../edit-all-metadata.service';
import { TemplateLocationTab } from 'app/types/template-location-tab.interface';
import { EditAllMetadataFromTemplateService } from '../edit-all-metadata-from-template.service';

const SHOW_OSM_LAYER = "Show OSM Layer";
const HIDE_OSM_LAYER = "Hide OSM Layer";

const DEFAULT_LATITUDE = 52;
const DEFAULT_LONGITUDE = 11;

@Component({
    selector: 'app-all-metadata-location-tab',
    templateUrl: './all-metadata-location-tab.component.html',
    styleUrls: ['./all-metadata-location-tab.component.scss', '../../css/global-app.scss']
})
export class AllMetadataLocationTabComponent implements OnInit, OnDestroy {
    templateIsLocationCopiedFromImage: boolean;
    templateIsTimeCopiedFromImage: boolean;
    templateIsLocationDisabled: boolean;
    templateIsTimeDisabled: boolean;
    templateLongitude: number;
    templateLatitude: number;
    templateDateTime: Date;

    private _isLocationCopiedFromImage: boolean = false;
    set isLocationCopiedFromImage(isLocationCopiedFromImage: boolean) {
        this._isLocationCopiedFromImage = isLocationCopiedFromImage;
    }
    get isLocationCopiedFromImage() {
        return this._isLocationCopiedFromImage;
    }


    private _isTimeCopiedFromImage: boolean = false;
    set isTimeCopiedFromImage(isTimeCopiedFromImage: boolean) {
        this._isTimeCopiedFromImage = isTimeCopiedFromImage;

    }
    get isTimeCopiedFromImage() {
        return this._isTimeCopiedFromImage;
    }


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


    private _isLocationDisabled: boolean = false;
    set isLocationDisabled(isLocationDisabled: boolean) {
        this._isLocationDisabled = isLocationDisabled;
        this.sendMetadataToService();
    }
    get isLocationDisabled() {
        return this._isLocationDisabled;
    }


    private _isTimeDisabled: boolean = false;
    set isTimeDisabled(isTimeDisabled: boolean) {
        this._isTimeDisabled = isTimeDisabled;
        this.sendMetadataToService();
    }
    get isTimeDisabled() {
        return this._isTimeDisabled;
    }



    latitudeControl = new FormControl(DEFAULT_LATITUDE);
    longitudeControl = new FormControl(DEFAULT_LONGITUDE);

    dateImageCreated = new FormControl(new Date());
    timeImageCreated = new FormControl(new Date());

    latLongZoom: LatLongZoom = { lat: DEFAULT_LATITUDE, long: DEFAULT_LONGITUDE, zoomLevel: 6 }

    buttonShowOSMLayerTitle = SHOW_OSM_LAYER;

    areLayersRequested = false;

    constructor(private _cdr: ChangeDetectorRef,
        private _editAllMetadataFromTemplateService: EditAllMetadataFromTemplateService,
        private _editAllMetadataService: EditAllMetadataService) {
        this.templateIsTimeCopiedFromImage = this._editAllMetadataFromTemplateService.location.isTimeCopiedFromImage;
        this.templateIsLocationCopiedFromImage = this._editAllMetadataFromTemplateService.location.isLocationCopiedFromImage;
        this.templateIsLocationDisabled = this._editAllMetadataFromTemplateService.location.isLocationDisabledByDefault;
        this.templateIsTimeDisabled = this._editAllMetadataFromTemplateService.location.isTimeDisabledByDefault;
        this.templateDateTime = this._editAllMetadataFromTemplateService.location.dateAndTime;
        this.templateLatitude = this._editAllMetadataFromTemplateService.location.latitude;
        this.templateLongitude = this._editAllMetadataFromTemplateService.location.longitude;
    }

    ngOnDestroy(): void {
        this.sendMetadataToService();
    }

    ngOnInit() {
        let metadata: TemplateLocationTab = this._editAllMetadataService.location;


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
                this.timeImageCreated.setValue(new Date());
            } else {
                this.dateImageCreated.setValue(new Date(metadata.dateAndTime));
                this.timeImageCreated.setValue(new Date(metadata.dateAndTime));
            }

        }

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

    sendMetadataToService() {
        let latitude;
        let longitude;
        let date: Date;

        date = new Date(this.dateImageCreated.value);
        let time = new Date(this.timeImageCreated.value);
        date.setHours(time.getHours());
        date.setMinutes(time.getMinutes());
        date.setSeconds(time.getSeconds());


        latitude = this.latitudeControl.value;
        longitude = this.longitudeControl.value;


        this._editAllMetadataService.updateLocation({
            longitude: longitude,
            latitude: latitude,
            dateAndTime: date,
            isTimeDisabledByDefault: this.isTimeDisabled,
            isLocationCopiedFromImage: this.isLocationCopiedFromImage,
            isLocationDisabledByDefault: this.isLocationDisabled,
            isTimeCopiedFromImage: this.isTimeCopiedFromImage
        });
    }

    setLocationFromTemplate() {
        this.isLocationCopiedFromImage = this.templateIsLocationCopiedFromImage;
        this.isLocationDisabled = this.templateIsLocationDisabled;
        this.latitudeControl.setValue(this.templateLatitude);
        this.longitudeControl.setValue(this.templateLongitude);
    }

    setTimeFromTemplate() {
        this.isTimeCopiedFromImage = this.templateIsTimeCopiedFromImage;
        this.isTimeDisabled = this.templateIsTimeDisabled;
        this.dateImageCreated.setValue(new Date(this.templateDateTime));
        this.timeImageCreated.setValue(new Date(this.templateDateTime));
    }

    isDateTimeSameAsTemplate(): boolean {
        if (this.templateDateTime) {
            let date = new Date(this.dateImageCreated.value);
            let time = new Date(this.timeImageCreated.value);
            date.setHours(time.getHours());
            date.setMinutes(time.getMinutes());
            date.setSeconds(time.getSeconds());

            return date.toString() === new Date(this.templateDateTime).toString();
        }
        return false;
    }
}
