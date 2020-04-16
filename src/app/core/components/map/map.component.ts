import { Component, OnInit, Inject, AfterViewInit, EventEmitter } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipSelectionChange } from '@angular/material/chips';
import BaseLayer from 'ol/layer/Base';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  loading_map = true;

  map: Map;
  source: VectorSource;
  source_cantiere: VectorSource;
  vector: VectorLayer;
  vector_cantiere: VectorLayer;
  draw: Draw;
  select: Select;
  translate;
  modify;
  eraser;

  base_layers;
  layers;

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

  constructor(
    public dialogRef: MatDialogRef<MapComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
    ) { }
    
  ngOnInit(): void {
    this.createMap();
  }
  
  createMap(){
    this.base_layers = this.createBaseLayers();
    
    this.layers = this.createLayers();
    
    
    this.select = new Select();
    
    this.map = new  Map({
      interactions: defaultInteractions().extend([this.select]),
      controls: defaultControls(
        {
          zoom: false,
          attributionOptions: {
            collapsible: true
          }
        }
      ).extend([
        new ScaleLine({
          bar: true,
          text: true,
          steps: 2
        }),
      ]),
      target: "map",
      layers: [
        ...this.base_layers,
        ...this.layers
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: proj.fromLonLat([9.32, 44.32]),
        zoom: 14
      }),
      
    });
    this.addCustomControls();
    console.log(this.map.getLayers().getArray()[0].getProperties());
    this.vector.getSource().on('addfeature', (event) => this.onDrawEnd(event));
    this.select.on('select', (event) => this.printInfo(event));
    this.loading_map = false;
  }

  addCustomControls(){
    let controls = this.createControls();
    controls.forEach(control => {
      this.map.addControl(control);
    });
  }

  createBaseLayers(){
    let base_layers = [];
    let oms = new TileLayer({
        source: new OSM(),
      });
    oms.setProperties({'name': 'Open Streat Map'});
    console.log(oms.get('name'));
    base_layers.push(oms);
    return base_layers;
  }

  createLayers(){
    let layers = [];
    this.source = new VectorSource({wrapX: false});
    this.vector = new VectorLayer({
      source: this.source,
      style: this.style
    });
    this.vector.setProperties({'name': 'Area scavi'});
    layers.push(this.vector);
    return layers;
  }

  onChangeWMS(layer: BaseLayer){
    layer.setVisible(!layer.getVisible());
  }

  onChangeBaseLayers(layer: BaseLayer){
    layer.setVisible(true);
    let base_layers = this.getBaseLayers()
    base_layers.forEach(base_layer => {
      if(base_layer != layer){
        base_layer.setVisible(false);
      }
    })
  }

  getBaseLayers(){
    return this.map.getLayers().getArray().filter(layer => layer instanceof TileLayer);
  }

  getLayers(){
    return this.map.getLayers().getArray().filter(layer => !(layer instanceof TileLayer));
  }

  createControls(){
    let controls = [];
    var element = document.getElementById('panel_options');
    var panel = new Control({element: element});
    controls.push(panel);
    var edit_options = document.getElementById('edit_panel');
    var edit_panel = new Control({element: edit_options});
    controls.push(edit_panel);
    var close_options = document.getElementById('close_panel');
    var close_panel = new Control({element: close_options});
    controls.push(close_panel);
    var zoom_options = document.getElementById('zoom_panel');
    var zoom_panel = new Control({element: zoom_options});
    controls.push(zoom_panel);
    var layers_options = document.getElementById('layers_panel');
    var layers_panel = new Control({element: layers_options});
    controls.push(layers_panel);
    return controls;
  }

  addInteraction(value) {
    if (!this.draw) {
      this.draw = new Draw({
        source: this.source,
        type: value,
        style: this.style_interaction
      });
      this.draw.on('drawstart', (event) => this.onDrawStart(event));
      this.draw.on('drawend', (event) => this.onDrawEnd(event));
      this.map.addInteraction(this.draw);
    } else {
      this.map.removeInteraction(this.draw);
      this.draw = null;
    }

  }

  onTranslate(){
    if(this.modify){
      this.map.removeInteraction(this.modify);
      this.modify = null;
    }
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
    if(this.translate){
      this.map.removeInteraction(this.translate);
      this.translate = null;
    }
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

  onCancel(){
    let selected_feature = this.select.getFeatures().getArray();
    if(selected_feature.length > 0){
      selected_feature.forEach(feature => {
        this.source.removeFeature(feature);
      });
      this._snackBar.open("Elementi cancellati", null, {duration: 2000});
    } else {
      this._snackBar.open("Nessuna geometria selezionata", null, {duration: 2000});
    }
    if(this.source.getFeatures().length == 0){
      if(this.translate){
        this.map.removeInteraction(this.translate);
        this.translate = null;
      }
      if(this.modify){
        this.map.removeInteraction(this.modify);
        this.modify = null;
      }
    }
  }

  onDrawStart(event){
    this.select.setActive(false);
  }

  onDrawEnd(event){
    console.log(event);
    this.map.removeInteraction(this.draw);
    this.draw = null;
    this.activeLater();
  }

  activeLater(){
    setTimeout(() => {
      this.select.setActive(true);
    }, 300);
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

  search(){
    console.log("search");
  }

  close(){
    this.dialogRef.close();
  }

  zoomIn(){
    var view = this.map.getView();
    var zoom = view.getZoom();
    view.setZoom(zoom + 1);
  }

  zoomOut(){
    var view = this.map.getView();
    var zoom = view.getZoom();
    view.setZoom(zoom - 1);
  }
}