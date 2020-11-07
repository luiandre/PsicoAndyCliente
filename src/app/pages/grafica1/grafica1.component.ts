import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  labels1: string[] = ['Chocolate', 'Helado', 'Pan'];
  data1 = [
    [500, 85, 100]
  ];

  labels2: string[] = ['Zapatos', 'Camisetas', 'Blusas'];
  data2 = [
    [56, 450, 1200]
  ];

  labels3: string[] = ['Primera', 'Segunda', 'Tercera'];
  data3 = [
    [200, 450, 35]
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
