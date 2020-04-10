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
import {defaults as defaultInteractions, Modify, Select} from 'ol/interaction';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import {getArea, getLength} from 'ol/sphere'
import OverlayPositioning from 'ol/OverlayPositioning';
import {unByKey} from 'ol/Observable';

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
  selectedFeatures;
  featureID = 0;
  selectedFeatureID;

  /**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
sketch;


/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
helpTooltipElement: HTMLElement;


/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
helpTooltip;


/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
 
measureTooltipElement: HTMLElement;


/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
continuePolygonMsg = 'Clicca per continuare a disegnare il poligono';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
continueLineMsg = 'Clicca per continuare a disegnare la linea';

listener;

  constructor(public dialogRef: MatDialogRef<MapComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
    this.createMap();
  }
  
  createMap(){
    this.source = new VectorSource({wrapX: false});
    this.source_cantiere = new VectorSource({wrapX: false});
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
    this.vector_cantiere = new VectorLayer({
      source: this.source_cantiere,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffaa33',
          width: 2
        }),
      })
    });
    this.select = new Select();
    this.selectedFeatures = this.select.getFeatures();
    var modify = new Modify({
      features: this.select.getFeatures()
    });

    this.map = new  Map({
      interactions: defaultInteractions().extend([this.select, modify]),
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vector,
        this.vector_cantiere
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: proj.fromLonLat([9.32, 44.32]),
        zoom: 14
      })
    });
   
    this.vector.getSource().on('addfeature', () => this.onDrawEnd());
    this.vector_cantiere.getSource().on('addfeature', () => this.onDrawEnd());
    this.select.on('select', () => this.printInfo());
  }

  addInteraction(value, source) {
    if (value !== 'None') {
      this.draw = new Draw({
        source: this[source],
        type: value,
        style: new Style({
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
      });
      this.draw.on('drawstart', (evt) => {

        this.select.setActive(false);

        this.sketch = evt.feature;

        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
        var tooltipCoord = evt.feature.getProperties().coordinate;

        this.listener = this.sketch.getGeometry().on('change', (evt) => {
          var geom = evt.target;
          var output;
          if (geom instanceof Polygon) {
            output = this.formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = this.formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          this.measureTooltipElement.innerHTML = output;
          this.measureTooltip.setPosition(tooltipCoord);
        });
      });
      this.draw.on('drawend', (event) => {
        console.log('drawend');
        this.select.setActive(true);
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        this.measureTooltip.setOffset([0, -7]);
        // unset sketch
        this.sketch = null;
        // unset tooltip so that a new one can be created
        this.measureTooltipElement = null;
        this.createMeasureTooltip();
        this.helpTooltipElement.classList.add('hidden');
        this.map.removeOverlay(this.helpTooltip);
        unByKey(this.listener);
      });
      this.map.addInteraction(this.draw);
      this.createMeasureTooltip();
      this.createHelpTooltip();
      this.map.on('pointermove', (evt) => {
        if (evt.dragging) {
          return;
        }
        /** @type {string} */
        var helpMsg = 'Clicca per iniziare a disegnare';
      
        if (this.sketch) {
          var geom = this.sketch.getGeometry();
          if (geom instanceof Polygon) {
            helpMsg = this.continuePolygonMsg;
          } else if (geom instanceof LineString) {
            helpMsg = this.continueLineMsg;
          }
        }
        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);
      
        this.helpTooltipElement.classList.remove('hidden');
      }
    );
    this.map.getViewport().addEventListener('mouseout', () => {
      this.helpTooltipElement.classList.add('hidden');
    });
    }

  }

  delaySelectActivate(){
    setTimeout(function(){
      this.select.setActive(true)
    },300);
  }

  onDrawEnd(){
    this.map.removeInteraction(this.draw);
  }

  printInfo(){
    console.log(this.select.getFeatures());
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


/**
 * Creates a new help tooltip
 */
createHelpTooltip() {
  if (this.helpTooltipElement) {
    this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
  }
  this.helpTooltipElement = document.createElement('div');
  this.helpTooltipElement.className = 'ol-tooltip hidden';
  this.helpTooltip = new Overlay({
    element: this.helpTooltipElement,
    offset: [15, 0],
    positioning: OverlayPositioning.CENTER_LEFT
  });
  this.map.addOverlay(this.helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
createMeasureTooltip() {
  if (this.measureTooltipElement) {
    this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
  }
  this.measureTooltipElement = document.createElement('div');
  this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  this.measureTooltip = new Overlay({
    element: this.measureTooltipElement,
    offset: [0, -15],
    positioning: OverlayPositioning.BOTTOM_CENTER
  });
  this.map.addOverlay(this.measureTooltip);
}
}