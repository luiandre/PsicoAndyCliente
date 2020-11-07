import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  // Doughnut
  // tslint:disable-next-line: no-input-rename
  @Input('labels') doughnutChartLabels: Label[] = ['Label 1', 'Label 2', 'Label 3'];
  // tslint:disable-next-line: no-input-rename
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100]
  ];

  @Input() colors: Color[] = [
    { backgroundColor: [ '#6857e6', '#009fee', '#f02059']}
  ];

  @Input() titulo = 'Sin Titulo';

  constructor() { }

  ngOnInit(): void {
  }

}
