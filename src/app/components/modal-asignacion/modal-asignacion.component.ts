import { Component, OnInit } from '@angular/core';
import { ModalAsignacionService } from '../../services/modal-asignacion.service';

@Component({
  selector: 'app-modal-asignacion',
  templateUrl: './modal-asignacion.component.html',
  styles: [
  ]
})
export class ModalAsignacionComponent implements OnInit {

  constructor(  public modalAsignacionService: ModalAsignacionService) { }

  ngOnInit(): void {
    console.log('se abrio');
  }

  cerrarModal() {
    this.modalAsignacionService.cerrarModal();
  }
}
