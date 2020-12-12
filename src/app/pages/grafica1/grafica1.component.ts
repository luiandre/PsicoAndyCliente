import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestAutoestimaService } from '../../services/test-autoestima.service';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  public id;

  labels1: string[] = [];
  data1 = [{ data: [], label: ''}];

  private tests: any[] = [];
  private labelTotal: any[] = [];
  private dataTotal: any[] = [];
  public fecha: Date = new Date();

  constructor(  private activatedRoute: ActivatedRoute,
                private testAutoestimaService: TestAutoestimaService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.id = id;
      this.cargarDatos(id);
    });
  }

  cargarDatos(id: string){
    this.testAutoestimaService.getTest(id).subscribe( resp => {
      this.tests = resp;
      this.tests.forEach( test => {
        this.fecha.setTime(test.fecha);
        const fecha = this.fecha.toLocaleDateString();
        console.log(fecha);
        this.dataTotal.push(test.total);
        this.labelTotal.push(fecha);
      });
      this.labels1 = this.labelTotal;
      const dataTemp: any[] = this.dataTotal;
      this.data1 = [{ data: dataTemp, label: 'Puntos totales de la encuesta'}];
    });
  }

}
