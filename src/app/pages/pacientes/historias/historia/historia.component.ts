import { Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../../../services/historias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Historia } from 'src/app/models/historia.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styles: [
  ]
})
export class HistoriaComponent implements OnInit {

  public id;
  public historia: Historia;
  public formSubmitted = false;
  public fechaPrimera: Date = new Date();
  public entrevistadorInfo = '';

  public historiaForm: FormGroup;

  constructor(  private historiasService: HistoriasService,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private router: Router) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {
      this.cargarHistoria(id);
    });

    this.historiaForm = this.fb.group({
      numero: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(6)]],
      fecha: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      entrevistador: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email, Validators.maxLength(50)]],
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      lugarNacimiento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      religion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      nacionalidad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      provincia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      ciudad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      cambioDomicilio: [false],
      motivo: [{value: '', disabled: false}] ,
      instruccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      ocupacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      estadoCivil: ['', [Validators.required]],
      conyuge: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nHijos: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      convecional: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      celular: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombreEmergencia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      telefonoEmergencia: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      direccionEmergencia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nombreAcompañante: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      motivoConsulta: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      factoresEpisodioActual: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      historiaEnfermedad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      natal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      infancia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      pubertad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      familiar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      social: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      laboral: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      psicosexual: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      conciencia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      voluntad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      atencion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      sensopercepciones: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      afectividad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      pensamiento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      memoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      aplicacionPruebas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      diagnostico: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      tratamiento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
    });
  }

  cargarHistoria(uid: string){
    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.historiasService.getHistoria(uid)
    .pipe(
      delay(1000)
    )
    .subscribe( historia => {

      Swal.close();

      if ( !historia ){
        return this.router.navigateByUrl('/dashboard/historias');
      }

      this.historia = historia;
      this.fechaPrimera.setTime(this.historia.fecha);
      const fechaPrimeraConsulta = this.fechaPrimera.toISOString().split('T')[0];
      this.entrevistadorInfo = historia.entrevistador.nombre + ' ' + historia.entrevistador.apellido;
      this.id = this.historia.id;

      this.historiaForm.setValue(
        {
          entrevistador: this.entrevistadorInfo || '',
          fecha: fechaPrimeraConsulta || '',
          email: this.historia.email || '',
          numero: this.historia.numero || '',
          nombres: this.historia.nombres || '',
          apellidos: this.historia.apellidos || '',
          fechaNacimiento: this.historia.fechaNacimiento || '',
          lugarNacimiento: this.historia.lugarNacimiento || '',
          sexo: this.historia.sexo || '',
          religion: this.historia.religion || '',
          nacionalidad: this.historia.nacionalidad || '',
          provincia: this.historia.provincia || '',
          ciudad: this.historia.ciudad || '',
          direccion: this.historia.direccion || '',
          cambioDomicilio: this.historia.cambioDomicilio || false,
          motivo: this.historia.motivo || '',
          instruccion: this.historia.instruccion || '',
          ocupacion: this.historia.ocupacion || '',
          estadoCivil: this.historia.estadoCivil || '',
          conyuge: this.historia.conyuge || '',
          nHijos: this.historia.nHijos || '',
          convecional: this.historia.convecional || '',
          celular: this.historia.celular || '',
          nombreEmergencia: this.historia.nombreEmergencia || '',
          telefonoEmergencia: this.historia.telefonoEmergencia || '',
          direccionEmergencia: this.historia.direccionEmergencia || '',
          nombreAcompañante: this.historia.nombreAcompañante || '',
          motivoConsulta: this.historia.motivoConsulta || '',
          factoresEpisodioActual: this.historia.factoresEpisodioActual || '',
          historiaEnfermedad: this.historia.historiaEnfermedad || '',
          natal: this.historia.natal || '',
          infancia: this.historia.infancia || '',
          pubertad: this.historia.pubertad || '',
          familiar: this.historia.familiar || '',
          social: this.historia.social || '',
          laboral: this.historia.laboral || '',
          psicosexual: this.historia.psicosexual || '',
          conciencia: this.historia.conciencia || '',
          voluntad: this.historia.voluntad || '',
          atencion: this.historia.atencion || '',
          sensopercepciones: this.historia.sensopercepciones || '',
          afectividad: this.historia.afectividad || '',
          pensamiento: this.historia.pensamiento || '',
          memoria: this.historia.memoria || '',
          aplicacionPruebas: this.historia.aplicacionPruebas || '',
          diagnostico: this.historia.diagnostico || '',
          tratamiento: this.historia.tratamiento || '',
        });

      this.cambiar();
      }, (err) => {
        Swal.close();
        return this.router.navigateByUrl('/dashboard/historias');
      }
    );
  }

  guardarHistoria(){
    this.formSubmitted = true;

    if (this.historiaForm.invalid) {
      return;
    }

    const historiaActualizada: Historia = {
      ...this.historiaForm.value
    };

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.historiasService.actualizarHistoria(this.id, historiaActualizada).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Historia clínica actualizada',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigateByUrl('/dashboard/historias');

    }, (err) => {
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });

  }

  campoNoValido(campo: string): boolean{

    if (this.historiaForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

  cambiar(){
    if (this.historiaForm.controls.cambioDomicilio.value){
        this.historiaForm.controls.motivo.enable();
        this.historiaForm.controls.motivo.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
        this.historiaForm.controls.motivo.updateValueAndValidity();
      } else {
        this.historiaForm.controls.motivo.setValue('');
        this.historiaForm.controls.motivo.disable();
        this.historiaForm.controls.motivo.setValidators([]);
        this.historiaForm.controls.motivo.updateValueAndValidity();
    }
  }

}
