import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private ocultarModal = true;
  public tipo: 'usuarios'|'servicios'|'noticias';
  public id: string;
  public img: string;

  public imgActualizada: EventEmitter<string> = new EventEmitter<string>();

  get getOcultarModal() {
    return this.ocultarModal;
  }

  abrirModal( tipo: 'usuarios'|'servicios'|'noticias', id: string, img: string = 'no-image') {
    this.ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }

  }

  cerrarModal() {
    this.ocultarModal = true;
  }

  constructor() { }
}
