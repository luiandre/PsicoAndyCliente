import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [
    {
      titulo: 'Clínica',
      icono: 'mdi mdi-city',
      submenu: [
        { titulo: 'Inicio', url: '/'},
        { titulo: 'Servicios', url: '/servicios'},
        { titulo: 'Conócenos', url: '/conocenos'},
        { titulo: 'Contáctanos', url: '/contactanos'},
      ]
    }
  ];

  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu')) || this.menu;
  }
}
