import { Component } from '@angular/core';

import { Location } from '@angular/common';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.css']
})
export class NopagefoundComponent {

  constructor(  private location: Location){}

  year = new Date().getFullYear();

  regresar(){
    this.location.back();
  }

}
