import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Map, View } from 'ol';
import { Layer } from 'ol/layer';
import * as proj from 'ol/proj';
import OSM from 'ol/source/OSM';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Draw from 'ol/interaction/Draw';
import TileLayer from 'ol/layer/Tile';
import Source from 'ol/source/Source';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import {defaults as defaultInteractions, Modify, Select} from 'ol/interaction';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  map: Map;
  source: VectorSource;
  vector: VectorLayer;
  draw: Draw;
  constructor(public dialogRef: MatDialogRef<MapComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
    this.createMap();
  }
  
  createMap(){
    this.source = new VectorSource({wrapX: false});

    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
      })
    });
    let select = new Select();
    
    var modify = new Modify({
      features: select.getFeatures()
    });

    this.map = new  Map({
      interactions: defaultInteractions().extend([select, modify]),
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.vector
      ],
      view: new View({
        center: proj.fromLonLat([9.32, 44.32]),
        zoom: 14
      })
    });
    this.vector.getSource().on('addfeature', () => this.onDrawEnd());
  }

  addInteraction(value) {
    if (value !== 'None') {
      this.draw = new Draw({
        source: this.source,
        type: value
      });
      this.map.addInteraction(this.draw);
    }
  }

  onDrawEnd(){
    console.log('entrato');
    this.map.removeInteraction(this.draw);
  }

}