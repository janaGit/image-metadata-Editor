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
  private map;
  private openStreetMapTile;
  private marker;

  @Input()
  set areLayersRequested(areLayersRequested: boolean) {
    if (areLayersRequested) {

      this.openStreetMapTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      if (this.map) {
        this.openStreetMapTile.addTo(this.map);
      }

    } else {

      if (this.openStreetMapTile && this.map) {
        this.openStreetMapTile.remove();
      }

    }

    this.initMap();
  }


  @Input() latLongZoom: LatLongZoom;

  @Input()
  set markerLatLong(latLong: LatLong) {
    if (this.marker) {
      this.marker.setLatLng(L.latLng(latLong.lat, latLong.long));
    }

  };
  @Output() markerLatLongChange = new EventEmitter<LatLong>();


  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {
  }

  private initMap(): void {
    if(this.map || !this.latLongZoom){
      return;
    }
    this.map = L.map('map', {
      center: [this.latLongZoom.lat, this.latLongZoom.long],
      zoom: this.latLongZoom.zoomLevel
    });

    if (this.openStreetMapTile) {
      this.openStreetMapTile.addTo(this.map);
    }

    this.marker = L.marker([this.latLongZoom.lat, this.latLongZoom.long], { draggable: true }).addTo(this.map);
    this.marker.on('move', this.onDragMarker.bind(this));


  }


  onDragMarker(e) {
    console.log("You dragged the marker to " + e.latlng);
    this.markerLatLongChange.emit({lat:e.latlng.lat, long: e.latlng.lng}); 
  }

}
