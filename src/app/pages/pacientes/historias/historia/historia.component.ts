import { Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../../../services/historias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Historia } from 'src/app/models/historia.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Columns, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';

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
  public fechaInfo = '';

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
      numero: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(6)]],
      fecha: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      entrevistador: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email, Validators.maxLength(50)]],
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      lugarNacimiento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      religion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nacionalidad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      provincia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      ciudad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      cambioDomicilio: [false],
      motivo: [{value: '', disabled: false}] ,
      instruccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      ocupacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
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
      this.fechaInfo = fechaPrimeraConsulta;

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

  generarPdf(){
    const pdf = new PdfMakeWrapper();

    pdf.info({
      title: 'Historia Clínica',
      author: 'PsicoAndy M&D',
      subject: 'Historia clínica' + this.historiaForm.value.numero,
    });

    pdf.add(new Txt('HISTORIA CLÍNICA').alignment('center').bold().fontSize(25).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Columns([new Txt('Historia N. :').bold().end, new Txt(this.historiaForm.value.numero).end]).end);
    pdf.add(new Columns([new Txt('Fecha 1ra consulta :').bold().end, new Txt(this.fechaInfo).end]).end);
    pdf.add(new Columns([new Txt('Entrevistador :').bold().end, new Txt(this.entrevistadorInfo).end]).end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('DATOS INFORMATIVOS').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Columns([new Txt('Nombres :').bold().end, new Txt(this.historiaForm.value.nombres).end]).end);
    pdf.add(new Columns([new Txt('Apellidos :').bold().end, new Txt(this.historiaForm.value.apellidos).end]).end);
    pdf.add(new Columns([new Txt('Sexo :').bold().end, new Txt(this.historiaForm.value.sexo).end]).end);
    pdf.add(new Columns([new Txt('Fecha de nacimiento :').bold().end, new Txt(this.historiaForm.value.fechaNacimiento).end]).end);
    pdf.add(new Columns([new Txt('Lugar de nacimiento :').bold().end, new Txt(this.historiaForm.value.lugarNacimiento).end]).end);
    pdf.add(new Columns([new Txt('Religión :').bold().end, new Txt(this.historiaForm.value.religion).end]).end);
    pdf.add(new Columns([new Txt('Nacionalidad :').bold().end, new Txt(this.historiaForm.value.nacionalidad).end]).end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('DIRECCIÓN').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Columns([new Txt('Provincia :').bold().end, new Txt(this.historiaForm.value.provincia).end]).end);
    pdf.add(new Columns([new Txt('Ciudad :').bold().end, new Txt(this.historiaForm.value.ciudad).end]).end);
    pdf.add(new Txt('Calle principal y secundaria  :').bold().end);
    pdf.add(new Txt(this.historiaForm.value.direccion).end);

    if (this.historiaForm.value.cambioDomicilio){
      pdf.add(new Columns([new Txt('Cambio de domicilio :').bold().end, new Txt('SI').end]).end);
      pdf.add(new Columns([new Txt('Motivos :').bold().end, new Txt(this.historiaForm.value.motivo).end]).end);
    } else {
      pdf.add(new Columns([new Txt('Cambio de domicilio :').bold().end, new Txt('NO').end]).end);
    }

    pdf.add(new Columns([new Txt('Instrucción :').bold().end, new Txt(this.historiaForm.value.instruccion).end]).end);
    pdf.add(new Columns([new Txt('Ocupación :').bold().end, new Txt(this.historiaForm.value.ocupacion).end]).end);
    pdf.add(new Columns([new Txt('Estado cívil :').bold().end, new Txt(this.historiaForm.value.estadoCivil).end]).end);
    pdf.add(new Columns([new Txt('Nombre del cónyuge :').bold().end, new Txt(this.historiaForm.value.conyuge).end]).end);
    pdf.add(new Columns([new Txt('Número de hijos :').bold().end, new Txt(this.historiaForm.value.nHijos).end]).end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('CONTACTOS').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Columns([new Txt('Convencional :').bold().end, new Txt(this.historiaForm.value.convecional).end]).end);
    pdf.add(new Columns([new Txt('Celular :').bold().end, new Txt(this.historiaForm.value.celular).end]).end);
    pdf.add(new Columns([new Txt('Email :').bold().end, new Txt(this.historia.email).end]).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Columns([new Txt('Contacto de Emergenicia:').bold().end, new Txt(this.historiaForm.value.nombreEmergencia).end]).end);
    pdf.add(new Columns([new Txt('Teléfono:').bold().end, new Txt(this.historiaForm.value.telefonoEmergencia).end]).end);
    pdf.add(new Txt('Dirección  :').bold().end);
    pdf.add(new Txt(this.historiaForm.value.direccionEmergencia).end);
    pdf.add(new Columns([new Txt('Nombre del acompañante:').bold().end, new Txt(this.historiaForm.value.nombreAcompañante).end]).end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('MOTIVO DE CONSULTA').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.motivoConsulta).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('FACTORES DESENCADENANTES DEL EPISODIO ACTUAL').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.factoresEpisodioActual).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('HISTORIA PASADA DE LA ENFERMEDAD').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.historiaEnfermedad).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('PSICOANAMNESIS PERSONAL NORMAL Y PATOLOGICA').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Natal').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.natal).alignment('justify').end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Infancia').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.infancia).alignment('justify').end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Pubertad y Adolescencia').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.pubertad).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('PSICOANAMNESIS FAMILIAR Y PATOLOGICA').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.familiar).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('HISTORIA SOCIAL').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.social).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('HISTORIA LABORAL').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.laboral).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('HISTORIA PSICOSEXUAL').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.psicosexual).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('EXPLORACIÓN DE FUNCIONES PSÍQUICAS').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Conciencia').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.conciencia).alignment('justify').end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Voluntad').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.voluntad).alignment('justify').end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Atención').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.atencion).alignment('justify').end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Sensopercepciones').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.sensopercepciones).alignment('justify').end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Afectividad').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.afectividad).alignment('justify').end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Pensamiento').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.pensamiento).alignment('justify').end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt('Memoria').bold().fontSize(15).end);
    pdf.add(new Txt(this.historiaForm.value.memoria).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('APLICACIÓN DE PRUEBAS PSICOLÓGICAS').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.aplicacionPruebas).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('DIAGNOSTICO PRESUNTIVO').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.diagnostico).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.add(new Txt('TRATAMIENTO Y RECOMENDACIONES').bold().decoration('underline').fontSize(20).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt(this.historiaForm.value.tratamiento).alignment('justify').end);
    pdf.add(pdf.ln(1));

    pdf.create().open();
  }

}
