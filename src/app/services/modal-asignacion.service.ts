import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalAsignacionService {

  private ocultarModal = true;
  public id: string;

  get getOcultarModal() {
    return this.ocultarModal;
  }

  abrirModal(uid: string) {
    this.id = uid;
    this.ocultarModal = false;
  }

  cerrarModal() {
    this.ocultarModal = true;
  }

  constructor() { }
}
