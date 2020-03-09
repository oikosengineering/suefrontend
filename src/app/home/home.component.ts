import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  richieste = [
    {name: "Richiesta rottura suolo", link: "pratiche/richiesta-rottura-suolo"}
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
