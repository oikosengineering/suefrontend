import { Component, OnInit } from '@angular/core';
import { version } from '../../../package.json';
import { environment } from '..//../environments/environment';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  copyrightDate: number = Date.now();
  version: string = version;
  env: string = environment.production ? '' : ' stage';
  constructor() { }

  ngOnInit(): void {
  }

}
