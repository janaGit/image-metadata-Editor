import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { LatLong } from '../types/latlong.interface';
import { LatLongZoom } from '../types/latlongzoom.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: L.MapComponent;
  private openStreetMapTile;
  private marker;
  private markerLayer: L.LayerGroup;
  private _isDisabled: boolean;
  private _areLayersRequested: boolean;
  private _markerLatLong: LatLong;

  @Input()
  set areLayersRequested(areLayersRequested: boolean) {
    this.initMap();
    this._areLayersRequested = areLayersRequested;
    if (areLayersRequested) {
      this.marker.dragging.enable();

      this.openStreetMapTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      this.openStreetMapTile.addTo(this.map);

    }
  }
  get areLayerRequested(): boolean {
    return this._areLayersRequested;
  }

  @Input() latLongZoom: LatLongZoom;

  @Input()
  set markerLatLong(latLong: LatLong) {
    this._markerLatLong = latLong;
    if (this.marker && this._areLayersRequested) {
      this.marker.setLatLng(L.latLng(latLong.lat, latLong.long));
    }

  };
  @Output() markerLatLongChange = new EventEmitter<LatLong>();

  @Input() set disabled(isDisabled: boolean) {
    this._isDisabled = isDisabled;
    if (!this.map) {
      return;
    }
    if (isDisabled) {
      this.map.dragging.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      this.map.boxZoom.disable();
      this.map.keyboard.disable();
      this.map.removeLayer(this.markerLayer);
    } else {
      this.map.dragging.enable();
      this.map.touchZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.scrollWheelZoom.enable();
      this.map.boxZoom.enable();
      this.map.keyboard.enable();
      this.map.addLayer(this.markerLayer);
    }
  }

  constructor() { }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

  private initMap(): void {
    if (!this.latLongZoom) {
      return;
    }
    if (this.markerLayer) {
      this.markerLayer.clearLayers();
    }
    if (this.map) {
      this.map.remove();
    }


    if (typeof this._markerLatLong !== "undefined") {
      this.map = L.map('map', {
        center: [this._markerLatLong.lat, this._markerLatLong.long],
        zoom: this.latLongZoom.zoomLevel
      });

    } else {
      this.map = L.map('map', {
        center: [this.latLongZoom.lat, this.latLongZoom.long],
        zoom: this.latLongZoom.zoomLevel
      });
    }

    this.markerLayer = new L.LayerGroup();
    this.markerLayer.addTo(this.map);

    if (typeof this._markerLatLong !== undefined) {
      this.marker = L.marker([this._markerLatLong.lat, this._markerLatLong.long]);
    } else {
      this.marker = L.marker([this.latLongZoom.lat, this.latLongZoom.long])
    }

    this.marker.addTo(this.markerLayer);
    this.marker.on('move', this.onDragMarker.bind(this));
  }


  onDragMarker(e) {
    console.log("You dragged the marker to " + e.latlng);
    this.markerLatLongChange.emit({ lat: e.latlng.lat, long: e.latlng.lng });
  }

}
