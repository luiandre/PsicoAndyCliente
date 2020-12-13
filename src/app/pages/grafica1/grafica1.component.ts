import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestAutoestimaService } from '../../services/test-autoestima.service';

interface Datos{
  labels: any[];
  data: any[];
}

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  public id;
  public cargando = true;

  labels1: string[] = [];
  data1 = [{ data: [], label: ''}];
  dataList = [{ data: [], label: ''}];
  testList = [];
  colors: any[] = [];
  colors1: any[] = [
    { backgroundColor: []}
  ];

  public tests: any[] = [];
  private labelTotal: any[] = [];
  private dataTotal: any[] = [];

  labelsList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  valoresList: number[] = [];
  tituloList: string;

  constructor(  private activatedRoute: ActivatedRoute,
                private testAutoestimaService: TestAutoestimaService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.id = id;
      this.cargarDatos(id);
    });
  }

  cargarDatos(id: string){
    this.cargando = true;
    this.testAutoestimaService.getTest(id).subscribe( resp => {
      this.tests = resp;
      this.tests.forEach( test => {
        const fecha: Date = new Date();
        fecha.setTime(test.fecha);
        const fechaString = fecha.toLocaleDateString();
        this.dataTotal.push(test.total);
        this.labelTotal.push(fechaString);
        this.colors.push('#009fee');

        this.tituloList = 'Puntos individuales por pregunta';
        const titulo = 'Fecha: ' + fechaString;
        this.valoresList = [
          Number(test.group1),
          Number(test.group2),
          Number(test.group3),
          Number(test.group4),
          Number(test.group5),
          Number(test.group6),
          Number(test.group7),
          Number(test.group8),
          Number(test.group9),
          Number(test.group10)
        ];

        this.dataList = [{data: this.valoresList, label: this.tituloList}];
        const testTemp = { data: this.dataList, labels: this.labelsList, titulo};
        this.testList.push(testTemp);
      });
      this.labels1 = this.labelTotal;
      const dataTemp: any[] = this.dataTotal;
      this.data1 = [{ data: dataTemp, label: 'Sumatoria de puntos del test'}];
      this.colors1 = [
        { backgroundColor: this.colors}
      ];
      this.cargando = false;
    });
  }

}
