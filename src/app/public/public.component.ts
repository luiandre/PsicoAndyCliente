import { Component, OnInit } from '@angular/core';

declare function customInitFunctions();

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styles: [
  ]
})
export class PublicComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    customInitFunctions();
  }

}
