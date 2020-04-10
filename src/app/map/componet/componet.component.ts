import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import { Layer } from 'ol/layer';
import * as proj from 'ol/proj';
import OSM from 'ol/source/OSM';

@Component({
  selector: 'app-componet',
  templateUrl: './componet.component.html',
  styleUrls: ['./componet.component.scss']
})
export class ComponetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.createMap();
  }
  
  createMap(){
    var map = new  Map({
      target: "map",
      layers: [
        new Layer({
          source: new OSM()
        })
      ],
      view: new View({
        center: proj.fromLonLat([37.41, 8.82]),
        zoom: 4
      })
    });
  }

}
