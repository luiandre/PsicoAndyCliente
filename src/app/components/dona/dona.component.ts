import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, Label } from 'ng2-charts';

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
    { backgroundColor: [ '#009fee', '#009fee', '#009fee', '#009fee', '#009fee', '#009fee', '#009fee', '#009fee', '#009fee', '#009fee']}
  ];

  @Input() titulo = 'Sin Titulo';

  @Input() maxValueY = 5;

  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{
      ticks: {
        min: 0,
        max: this.maxValueY,
      }
    }]},
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
  };

  constructor() { }

  ngOnInit(): void {
    this.barChartOptions = {
      responsive: true,
      scales: { xAxes: [{}], yAxes: [{
        ticks: {
          min: 0,
          max: this.maxValueY,
        }
      }]},
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        },
      }
    };
  }

}
