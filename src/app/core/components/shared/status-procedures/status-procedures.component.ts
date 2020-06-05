import { Component, OnInit, Input } from '@angular/core';
import { StatusPipe } from 'src/app/core/pipes/status.pipe';

@Component({
  selector: 'status-procedures',
  templateUrl: './status-procedures.component.html',
  styleUrls: ['./status-procedures.component.scss']
})
export class StatusProceduresComponent implements OnInit {
  @Input() status: string
  data;
  constructor(
    private pipe: StatusPipe
  ) { }

  ngOnInit(): void {
    this.data = this.pipe.transform(this.status);
  }

}
