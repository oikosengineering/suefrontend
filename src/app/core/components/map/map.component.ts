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
  select: Select;
  featureID = 0;
  selectedFeatureID;

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
    this.select = new Select();
    
    var modify = new Modify({
      features: this.select.getFeatures()
    });

    this.map = new  Map({
      interactions: defaultInteractions().extend([this.select, modify]),
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
    this.select.getFeatures().on('add', function (event) {
      var properties = event.element.getProperties();
      this.selectedFeatureID = properties.id;       
     });
  }

  addInteraction(value) {
    if (value !== 'None') {
      this.draw = new Draw({
        source: this.source,
        type: value
      });
      this.draw.on('drawend', (event) => {
        console.log("drawend")
        this.featureID = this.featureID + 1;
        event.feature.setId(this.featureID);
        console.log(event.feature);
        console.log(this.featureID);
     })
      this.map.addInteraction(this.draw);
    }
  }

  onDrawEnd(){
    console.log('entrato');
    this.map.removeInteraction(this.draw);
  }

  printInfo(){
    console.log(this.select.getFeatures());
  }

  removeSelectedFeature() {
    let features = this.source.getFeatures();
      if (features != null && features.length > 0) {
          features.forEach(feature => {
             let properties = feature.getProperties();
             console.log(properties);
             var id = properties.id;
             if (id == this.selectedFeatureID) {
               this.source.removeFeature(feature);
                return;
             }
           }
          )
         }
       }

}