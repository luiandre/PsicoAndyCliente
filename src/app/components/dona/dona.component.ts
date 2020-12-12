import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  // Doughnut
  // tslint:disable-next-line: no-input-rename
  @Input('labels') barChartLabels: Label[] = [];
  // tslint:disable-next-line: no-input-rename
  @Input('data') barChartData: ChartDataSets[] = [
    { data: [], label: ''}
  ];

  @Input() colors: Color[] = [
    { backgroundColor: [ '#009fee', '#009fee', '#009fee']}
  ];

  @Input() titulo = 'Sin Titulo';

  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}
