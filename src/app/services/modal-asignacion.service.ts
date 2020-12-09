import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalAsignacionService {
  private ocultarModal = true;
  public tipo: 'usuarios'|'servicios'|'noticias';
  public id: string;
  public img: string;

  public imgActualizada: EventEmitter<string> = new EventEmitter<string>();

  get getOcultarModal() {
    return this.ocultarModal;
  }

  abrirModal(uid: string) {
    this.ocultarModal = false;
    this.id = uid;
  }

  cerrarModal() {
    this.ocultarModal = true;
  }

  constructor() { }
}
