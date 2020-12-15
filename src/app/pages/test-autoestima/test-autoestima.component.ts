import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TestAutoestimaService } from '../../services/test-autoestima.service';
import { TestAutoestima } from '../../models/testAutoestima.model';

@Component({
  selector: 'app-test-autoestima',
  templateUrl: './test-autoestima.component.html',
  styles: [
  ]
})
export class TestAutoestimaComponent implements OnInit {

  public formSubmitted = false;
  public total = 0;

  constructor(  private fb: FormBuilder,
                private testAutoestimaService: TestAutoestimaService) { }

  testForm = this.fb.group({
    group1: ['', [Validators.required]],
    group2: ['', [Validators.required]],
    group3: ['', [Validators.required]],
    group4: ['', [Validators.required]],
    group5: ['', [Validators.required]],
    group6: ['', [Validators.required]],
    group7: ['', [Validators.required]],
    group8: ['', [Validators.required]],
    group9: ['', [Validators.required]],
    group10: ['', [Validators.required]],
  });

  ngOnInit(): void {
  }

  enviar(){
    this.formSubmitted = true;

    if (this.testForm.invalid) {
      return;
    }

    this.total =
      Number(this.testForm.value.group1) + Number(this.testForm.value.group2)
      + Number(this.testForm.value.group3) + Number(this.testForm.value.group4)
      + Number(this.testForm.value.group5) + Number(this.testForm.value.group6)
      + Number(this.testForm.value.group7) + Number(this.testForm.value.group8)
      + Number(this.testForm.value.group9) + Number(this.testForm.value.group10);

    const test: TestAutoestima = {
      total: this.total,
      ...this.testForm.value
    };

    this.testAutoestimaService.crearTest(test).subscribe( resp => {
      if (this.total <= 40 && this.total >= 30){
        Swal.fire(
          'Su resultado es: ' + this.total,
          'Autoestima elevada. Considerada como autoestima normal',
          'success'
        );
      } else if (this.total <= 29 && this.total >= 26){
        Swal.fire(
          'Su resultado es: ' + this.total,
          'Autoestima media. Sin problemas de autoestima significantes, pero podemos mejorar',
          'info'
        );
      } else {
        Swal.fire(
          'Su resultado es: ' + this.total,
          'Autoestima baja. Hemos encontrado algunos problemas, pero no te preocupes, estamos para ayudarte',
          'warning'
        );
      }
    }, err => {
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });

  }

  campoNoValido(campo: string): boolean{
    if (this.testForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

}
