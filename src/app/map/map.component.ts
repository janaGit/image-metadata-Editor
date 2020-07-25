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
  private markerLayer;

  @Input()
  set areLayersRequested(areLayersRequested: boolean) {
    this.initMap();
    if (areLayersRequested) {
      this.openStreetMapTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      this.openStreetMapTile.addTo(this.map);
 
    }
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
    
  }

  ngOnInit(): void {
  }

  private initMap(): void {
    if (!this.latLongZoom) {
      return;
    }
    if (this.map) {
      this.map.remove();
    }
    if(this.markerLayer){
      this.markerLayer.clearLayers();
    }
    

    this.map = L.map('map', {
      center: [this.latLongZoom.lat, this.latLongZoom.long],
      zoom: this.latLongZoom.zoomLevel
    });
    this.markerLayer = new L.LayerGroup().addTo(this.map);
  
    this.marker = L.marker([this.latLongZoom.lat, this.latLongZoom.long], { draggable: true }).addTo(this.markerLayer);
    this.marker.on('move', this.onDragMarker.bind(this));
  }


  onDragMarker(e) {
    console.log("You dragged the marker to " + e.latlng);
    this.markerLatLongChange.emit({ lat: e.latlng.lat, long: e.latlng.lng });
  }

}
