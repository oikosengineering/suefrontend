import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Map, View, Overlay } from 'ol';
import { Layer } from 'ol/layer';
import * as proj from 'ol/proj';
import OSM from 'ol/source/OSM';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Draw from 'ol/interaction/Draw';
import TileLayer from 'ol/layer/Tile';
import Source from 'ol/source/Source';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {Circle as CircleStyle} from 'ol/style';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import {defaults as defaultInteractions, Modify, Select, Translate} from 'ol/interaction';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import {getArea, getLength} from 'ol/sphere'
import OverlayPositioning from 'ol/OverlayPositioning';
import {unByKey} from 'ol/Observable';
import {defaults as defaultControls, FullScreen, Control} from 'ol/control';
import ScaleLine from 'ol/control/ScaleLine';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  map: Map;
  source: VectorSource;
  source_cantiere: VectorSource;
  vector: VectorLayer;
  vector_cantiere: VectorLayer;
  draw: Draw;
  select: Select;
  translate;
  modify;

  style = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#ffcc33',
      width: 2
    }),
  });

  style_interaction = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)'
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      })
    })
  })

  constructor(public dialogRef: MatDialogRef<MapComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
    this.createMap();
  }
  
  createMap(){
    this.source = new VectorSource({wrapX: false});
    this.vector = new VectorLayer({
      source: this.source,
      style: this.style
    });
    
    this.select = new Select();

    var element = document.getElementById('panel_options');
    var panel = new Control({element: element});
    this.map = new  Map({
      interactions: defaultInteractions().extend([this.select]),
      controls: defaultControls().extend([
        new FullScreen(),
        new ScaleLine({
          bar: true,
          text: true,
          steps: 1
        }),
        panel,
      ]),
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vector
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: proj.fromLonLat([9.32, 44.32]),
        zoom: 14
      }),
      
    });
   
    this.vector.getSource().on('addfeature', (event) => this.onDrawEnd(event));
    this.select.on('select', (event) => this.printInfo(event));
  }

  addInteraction(value) {
    if (value !== 'None') {
      this.draw = new Draw({
        source: this.source,
        type: value,
        style: this.style_interaction
      });
      this.draw.on('drawstart', (event) => this.onDrawStart(event));
      this.draw.on('drawend', (event) => this.onDrawEnd(event));
      this.map.addInteraction(this.draw);
    }

  }

  onTranslate(){
    if(!this.translate){
      this.translate = new Translate({
        features: this.select.getFeatures()
      });
      this.map.addInteraction(this.translate);
    } else {
      this.map.removeInteraction(this.translate);
      this.translate = null;
    }
  }

  onModify(){
    if(!this.modify){
      this.modify = new Modify({
        features: this.select.getFeatures()
      });
      this.map.addInteraction(this.modify);
    } else {
      this.map.removeInteraction(this.modify);
      this.modify = null;
    }
  }

  onDrawStart(event){
    this.select.setActive(false);
  }

  onDrawEnd(event){
    console.log(event);
    this.map.removeInteraction(this.draw);
    this.select.setActive(true);
  }

  printInfo(event){
    console.log(event.selected);
  }

  formatLength(line){
    var length = getLength(line);
    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
          ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
          ' ' + 'm';
    }
    return output;
  };

  formatArea(polygon){
    var area = getArea(polygon);
    var output;

    output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
    return output;
  };

}