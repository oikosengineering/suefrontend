import { Component, OnInit, Inject, AfterViewInit, EventEmitter } from '@angular/core';
import { Map, View, Overlay, Feature } from 'ol';
import { Layer } from 'ol/layer';
import * as proj from 'ol/proj';
import OSM from 'ol/source/OSM';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Draw from 'ol/interaction/Draw';
import TileLayer from 'ol/layer/Tile';
import Source from 'ol/source/Source';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector';
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
import BaseLayer from 'ol/layer/Base';
import WKT from 'ol/format/WKT';
import { layer } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  loading_map = true;

  options = this.data;
  

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

  style_scavo = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#ff8247',
      width: 2
    }),
  });

  style_cantiere = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#2a623d',
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
    this.checkInitFeatures();
    this.map.getLayers().getArray().forEach(layer => {
      if(!(layer instanceof TileLayer)){
        layer.get('source').on('addfeature', (event) => this.onAddFeature(event));
      }
    });
    // this.vector.getSource().on('addfeature', (event) => this.onAddFeature(event));
    this.select.on('select', (event) => this.printInfo(event));
    this.loading_map = false;
  }

  addCustomControls(){
    let controls = this.createControls();
    controls.forEach(control => {
      this.map.addControl(control);
    });
  }

  checkInitFeatures(){
    if(this.options.features.length > 0){
      let format = new WKT()
      this.options.features.forEach(init_feature => {
        let layer = this.map.getLayers().getArray().find(layer => layer.get('id') == init_feature.type);
        let source: VectorSource = layer.get('source');
        init_feature.features.forEach(feature => {
          let new_feature = format.readFeature(feature);
          new_feature.setProperties({'target': init_feature.type})
          source.addFeature(new_feature);
        });
      })
    }
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
    this.options.layers.forEach(layer => {
      let source = new VectorSource({wrapX: false});
      let vector = new VectorLayer({
        source: source,
        style: this[layer.style]
      });
      vector.setProperties({'name': layer.name});
      vector.setProperties({'id': layer.id});
      layers.push(vector);
    });
    // this.source = new VectorSource({wrapX: false});
    // this.vector = new VectorLayer({
    //   source: this.source,
    //   style: this.style
    // });
    // this.vector.setProperties({'name': 'Area scavi'});
    // layers.push(this.vector);
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

  addInteraction(value, style, target) {
    let layer = this.map.getLayers().getArray().find(layer => layer.get('id') == target)
    let source = layer.get('source');
    if (!this.draw) {
      this.draw = new Draw({
        source: source,
        type: value,
        style: this.style_interaction
      });
      this.draw.on('drawstart', (event) => this.onDrawStart(event));
      this.draw.on('drawend', (event) => this.onDrawEnd(event, target));
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
    if(this.translate){
      this.map.removeInteraction(this.translate);
      this.translate = null;
    }
    if(this.modify){
      this.map.removeInteraction(this.modify);
      this.modify = null;
    }
    let selected_feature = this.select.getFeatures().getArray();
    if(selected_feature.length > 0){
      selected_feature.forEach(feature => {
        let layer = this.map.getLayers().getArray().find(layer => layer.get('id') == feature.get('target'));
        let source = layer.get('source');
        source.removeFeature(feature);
      });
      this._snackBar.open("Elementi cancellati", null, {duration: 2000});
    } else {
      this._snackBar.open("Nessuna geometria selezionata", null, {duration: 2000});
    }
  }

  onDrawStart(event){
    this.select.setActive(false);
  }

  onDrawEnd(event, target){
    console.log(event);
    event.feature.setProperties({'target': target});
    this.map.removeInteraction(this.draw);
    this.draw = null;
    this.activeLater();
  }

  onAddFeature(event: VectorSourceEvent){
    // event.feature.setStyle(this.style_scavo);
  }

  activeLater(){
    setTimeout(() => {
      this.select.setActive(true);
    }, 300);
  }

  printInfo(event){
    let features: Feature[] = event.selected;
    console.log(features);
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
    let result = [];
    let total_area = 0;
    let new_features = this.options.features;
    let format = new WKT();
    let layers = this.map.getLayers().getArray().filter(layer => this.options.layers.find(mylayer => mylayer.id == layer.get('id')));
    layers.forEach(layer => {
        let features: Feature[] = layer.get('source').getFeatures();
        features.forEach(feature => {
          result.push(format.writeFeature(feature));
          let area = getArea(feature.getGeometry());
          total_area += Math.round((area + Number.EPSILON) * 100) / 100
        })
        let dest = new_features.find(opt_feature => opt_feature.type == layer.get('id'));
        dest.features = [];
        dest.area = total_area;
        dest.features.push(...result);
        result = []
        total_area = 0;
    })
    this.dialogRef.close(new_features);
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