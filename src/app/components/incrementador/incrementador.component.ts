import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('valor') progreso = 50;
  @Input() btnClass = 'btn-primary';

  // tslint:disable-next-line: no-output-rename
  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();
  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`;
  }

  cambiarValor( valor: number){

    if (this.progreso >= 100 && valor >= 0) {
      this.valorSalida.emit(100);
      return this.progreso = 100;
    }

    if (this.progreso <= 0 && valor < 0) {
      this.valorSalida.emit(0);
      return this.progreso = 0;
    }

    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
  }

  onChange( valor: number){

    if (valor >= 100) {
      valor = 100;
    } else if ( valor <= 0) {
      valor = 0;
    }

    this.valorSalida.emit(valor);
  }

}
