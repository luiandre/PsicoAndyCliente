import { Component, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  titulo: string;
  tituloSub$: Subscription;

  constructor(  private router: Router) {
    this.tituloSub$ = this.getArgumentosRuta().subscribe( ({titulo}) => this.titulo = titulo);
  }

  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
  }

  getArgumentosRuta(){
    return this.router.events
    .pipe(
      filter(event => event instanceof ActivationEnd),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (event: ActivationEnd) => event.snapshot.data),
    );
  }

}
