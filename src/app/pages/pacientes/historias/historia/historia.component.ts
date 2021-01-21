import { Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../../../services/historias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Historia } from 'src/app/models/historia.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Columns, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import { CryptoService } from '../../../../services/crypto.service';
import { environment } from 'src/environments/environment';

const clave_crypt = environment.clave_crypt;

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
                private router: Router,
                private cryptoService: CryptoService) { }

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
          numero: this.historia.numero || '',
          email: this.cryptoService.get(clave_crypt, this.historia.email || ''),
          nombres: this.cryptoService.get(clave_crypt, this.historia.nombres || ''),
          apellidos: this.cryptoService.get(clave_crypt, this.historia.apellidos || ''),
          fechaNacimiento: this.cryptoService.get(clave_crypt, this.historia.fechaNacimiento || ''),
          lugarNacimiento: this.cryptoService.get(clave_crypt, this.historia.lugarNacimiento || ''),
          sexo: this.cryptoService.get(clave_crypt, this.historia.sexo || ''),
          religion: this.cryptoService.get(clave_crypt, this.historia.religion || ''),
          nacionalidad: this.cryptoService.get(clave_crypt, this.historia.nacionalidad || ''),
          provincia: this.cryptoService.get(clave_crypt, this.historia.provincia || ''),
          ciudad: this.cryptoService.get(clave_crypt, this.historia.ciudad || ''),
          direccion: this.cryptoService.get(clave_crypt, this.historia.direccion || ''),
          cambioDomicilio: this.historia.cambioDomicilio || false,
          motivo: this.cryptoService.get(clave_crypt, this.historia.motivo || ''),
          instruccion: this.cryptoService.get(clave_crypt, this.historia.instruccion || ''),
          ocupacion: this.cryptoService.get(clave_crypt, this.historia.ocupacion || ''),
          estadoCivil: this.cryptoService.get(clave_crypt, this.historia.estadoCivil || ''),
          conyuge: this.cryptoService.get(clave_crypt, this.historia.conyuge || ''),
          nHijos: this.historia.nHijos || 0,
          convecional: this.cryptoService.get(clave_crypt, this.historia.convecional || ''),
          celular: this.cryptoService.get(clave_crypt, this.historia.celular || ''),
          nombreEmergencia: this.cryptoService.get(clave_crypt, this.historia.nombreEmergencia || ''),
          telefonoEmergencia: this.cryptoService.get(clave_crypt, this.historia.telefonoEmergencia || ''),
          direccionEmergencia: this.cryptoService.get(clave_crypt, this.historia.direccionEmergencia || ''),
          nombreAcompañante: this.cryptoService.get(clave_crypt, this.historia.nombreAcompañante || ''),
          motivoConsulta: this.cryptoService.get(clave_crypt, this.historia.motivoConsulta || ''),
          factoresEpisodioActual: this.cryptoService.get(clave_crypt, this.historia.factoresEpisodioActual || ''),
          historiaEnfermedad: this.cryptoService.get(clave_crypt, this.historia.historiaEnfermedad || ''),
          natal: this.cryptoService.get(clave_crypt, this.historia.natal || ''),
          infancia: this.cryptoService.get(clave_crypt, this.historia.infancia || ''),
          pubertad: this.cryptoService.get(clave_crypt, this.historia.pubertad || ''),
          familiar: this.cryptoService.get(clave_crypt, this.historia.familiar || ''),
          social: this.cryptoService.get(clave_crypt, this.historia.social || ''),
          laboral: this.cryptoService.get(clave_crypt, this.historia.laboral || ''),
          psicosexual: this.cryptoService.get(clave_crypt, this.historia.psicosexual || ''),
          conciencia: this.cryptoService.get(clave_crypt, this.historia.conciencia || ''),
          voluntad: this.cryptoService.get(clave_crypt, this.historia.voluntad || ''),
          atencion: this.cryptoService.get(clave_crypt, this.historia.atencion || ''),
          sensopercepciones: this.cryptoService.get(clave_crypt, this.historia.sensopercepciones || ''),
          afectividad: this.cryptoService.get(clave_crypt, this.historia.afectividad || ''),
          pensamiento: this.cryptoService.get(clave_crypt, this.historia.pensamiento || ''),
          memoria: this.cryptoService.get(clave_crypt, this.historia.memoria || ''),
          aplicacionPruebas: this.cryptoService.get(clave_crypt, this.historia.aplicacionPruebas || ''),
          diagnostico: this.cryptoService.get(clave_crypt, this.historia.diagnostico || ''),
          tratamiento: this.cryptoService.get(clave_crypt, this.historia.tratamiento || ''),
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
          numero: this.historiaForm.value.numero,
          nombres: this.cryptoService.set(clave_crypt, this.historiaForm.value.nombres),
          apellidos: this.cryptoService.set(clave_crypt, this.historiaForm.value.apellidos),
          fechaNacimiento: this.cryptoService.set(clave_crypt, this.historiaForm.value.fechaNacimiento),
          lugarNacimiento: this.cryptoService.set(clave_crypt, this.historiaForm.value.lugarNacimiento),
          sexo: this.cryptoService.set(clave_crypt, this.historiaForm.value.sexo),
          religion: this.cryptoService.set(clave_crypt, this.historiaForm.value.religion),
          nacionalidad: this.cryptoService.set(clave_crypt, this.historiaForm.value.nacionalidad),
          provincia: this.cryptoService.set(clave_crypt, this.historiaForm.value.provincia),
          ciudad: this.cryptoService.set(clave_crypt, this.historiaForm.value.ciudad),
          direccion: this.cryptoService.set(clave_crypt, this.historiaForm.value.direccion),
          cambioDomicilio: this.historia.cambioDomicilio,
          motivo: this.cryptoService.set(clave_crypt, this.historiaForm.value.motivo || ''),
          instruccion: this.cryptoService.set(clave_crypt, this.historiaForm.value.instruccion),
          ocupacion: this.cryptoService.set(clave_crypt, this.historiaForm.value.ocupacion),
          estadoCivil: this.cryptoService.set(clave_crypt, this.historiaForm.value.estadoCivil),
          conyuge: this.cryptoService.set(clave_crypt, this.historiaForm.value.conyuge),
          nHijos: Number(this.historiaForm.value.nHijos),
          convecional: this.cryptoService.set(clave_crypt, this.historiaForm.value.convecional),
          celular: this.cryptoService.set(clave_crypt, this.historiaForm.value.celular),
          nombreEmergencia: this.cryptoService.set(clave_crypt, this.historiaForm.value.nombreEmergencia),
          telefonoEmergencia: this.cryptoService.set(clave_crypt, this.historiaForm.value.telefonoEmergencia),
          direccionEmergencia: this.cryptoService.set(clave_crypt, this.historiaForm.value.direccionEmergencia),
          nombreAcompañante: this.cryptoService.set(clave_crypt, this.historiaForm.value.nombreAcompañante),
          motivoConsulta: this.cryptoService.set(clave_crypt, this.historiaForm.value.motivoConsulta),
          factoresEpisodioActual: this.cryptoService.set(clave_crypt, this.historiaForm.value.factoresEpisodioActual),
          historiaEnfermedad: this.cryptoService.set(clave_crypt, this.historiaForm.value.historiaEnfermedad),
          natal: this.cryptoService.set(clave_crypt, this.historiaForm.value.natal),
          infancia: this.cryptoService.set(clave_crypt, this.historiaForm.value.infancia),
          pubertad: this.cryptoService.set(clave_crypt, this.historiaForm.value.pubertad),
          familiar: this.cryptoService.set(clave_crypt, this.historiaForm.value.familiar),
          social: this.cryptoService.set(clave_crypt, this.historiaForm.value.social),
          laboral: this.cryptoService.set(clave_crypt, this.historiaForm.value.laboral),
          psicosexual: this.cryptoService.set(clave_crypt, this.historiaForm.value.psicosexual),
          conciencia: this.cryptoService.set(clave_crypt, this.historiaForm.value.conciencia),
          voluntad: this.cryptoService.set(clave_crypt, this.historiaForm.value.voluntad),
          atencion: this.cryptoService.set(clave_crypt, this.historiaForm.value.atencion),
          sensopercepciones: this.cryptoService.set(clave_crypt, this.historiaForm.value.sensopercepciones),
          afectividad: this.cryptoService.set(clave_crypt, this.historiaForm.value.afectividad),
          pensamiento: this.cryptoService.set(clave_crypt, this.historiaForm.value.pensamiento),
          memoria: this.cryptoService.set(clave_crypt, this.historiaForm.value.memoria),
          aplicacionPruebas: this.cryptoService.set(clave_crypt, this.historiaForm.value.aplicacionPruebas),
          diagnostico: this.cryptoService.set(clave_crypt, this.historiaForm.value.diagnostico),
          tratamiento: this.cryptoService.set(clave_crypt, this.historiaForm.value.tratamiento),
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
    pdf.add(new Columns([new Txt('Email :').bold().end, new Txt(this.cryptoService.get(clave_crypt, this.historia.email)).end]).end);
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
