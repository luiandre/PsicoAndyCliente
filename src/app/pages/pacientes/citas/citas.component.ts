import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CitasService } from '../../../services/citas.service';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Cita } from '../../../models/cita.model';
import { Usuario } from '../../../models/usuario.model';
import { Mensaje } from 'src/app/models/mensaje.model';
import { MensajeService } from '../../../services/mensajes.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

const socket_url = environment.socket_url;


@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  initialEvents: EventInput[] = [];
  paciente: Usuario;
  servicio: string;
  public socket = io(socket_url);

  calendarOptions: CalendarOptions =  {
    plugins: [ timeGridPlugin ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridDay',
    },
    locale: esLocale,
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleDrop.bind(this)
  };
  currentEvents: EventApi[] = [];
  uid: string;

  constructor(  private citasService: CitasService,
                private usuarioService: UsuarioService,
                private mensajeService: MensajeService) {
                  this.uid = this.usuarioService.uid;
                }

  ngOnInit(): void {
    this.cargarCitas();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.guardarCita(selectInfo);
  }

  async guardarCita(selectInfo: DateSelectArg){
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    const { value: email } = await Swal.fire({
      title: 'Fecha: ' + selectInfo.startStr,
      input: 'email',
      inputPlaceholder: 'Ingresa el email del paciente',
      showCancelButton: true,
      confirmButtonText: 'Siguiente',
      cancelButtonText: 'Cancelar',
      validationMessage: 'Ingrese un email',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          this.usuarioService.getUsuarioEmail(value).subscribe( resp => {
            this.paciente = resp;
              resolve();
          }, err => {
            resolve(err.error.msg);
          });
        })
      }
    })
    
    if (email) {
      const { value: servicio } = await Swal.fire({
        title: 'Paciente: ' + this.paciente.nombre + ' ' + this.paciente.apellido,
        input: 'text',
        inputPlaceholder: 'Ingrese detalles del servicio',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        validationMessage: 'El detalle del servicio es requerido',
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if(value){
              this.servicio = value;
              resolve();
            } else {
              resolve('El detalle del servicio es requerido');
            }
          })
        }
      })
      
      if (servicio) {
        const cita: Cita = {
          titulo: this.servicio,
          paciente: this.paciente.uid,
          usuario: this.uid,
          fecha: selectInfo.startStr
        };

        Swal.fire({
          icon: 'warning',
          title: 'Espere por favor...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
              Swal.showLoading();
          },
        });

        this.citasService.crearCita(cita).subscribe( (resp: any) => {
          calendarApi.addEvent({
            id: resp.cita.id,
            title: cita.titulo,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          });

          console.log(resp.cita);

          const mensaje = `Su cita se agendó para la fecha ${resp.cita.fecha} con el profesional ${this.usuarioService.usuario.nombre} ${this.usuarioService.usuario.apellido}`;
          
          const mensajeEnviar: Mensaje = {
            de: this.usuarioService.uid,
            para: this.paciente.uid,
            mensaje: mensaje
          };
      
          this.mensajeService.enviarMensaje(mensajeEnviar).subscribe( (resp: Mensaje) => {
            this.socket.emit('guardar-mensaje', resp.mensaje);
          });

          Swal.close();
        }, err => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: err.error.msg,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.accederCita(clickInfo);
  }

  accederCita(clickInfo: EventClickArg){
    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });
    this.citasService.getCita(clickInfo.event.id).subscribe( async resp => {
      Swal.close();
      await Swal.fire({
        title: 'Paciente: ' + resp.paciente.nombre + ' ' +  resp.paciente.apellido,
        html: '<b>' + 'Fecha: ' +'<b>' + resp.fecha,
        input: 'text',
        inputPlaceholder: 'Ingrese detalles del servicio',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        validationMessage: 'El detalle del servicio es requerido',
        inputValue: resp.titulo,
        showDenyButton: true,
        denyButtonText: `Eliminar`,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if(value){
              this.servicio = value;
              resolve();
            } else {
              resolve('El detalle del servicio es requerido');
            }
          })
        }
      }).then(
        result => {
          if (result.isConfirmed) {
            const dataCita: Cita = {
              titulo: this.servicio,
            };
            this.actualizarCita(resp.id, dataCita, clickInfo);
          } else if (result.isDenied) {
            this.eliminarCita(clickInfo);
          }
        }
      );

      
    }, err => {
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }

  actualizarCita(id: string, cita: Cita, clickInfo: EventClickArg){
    
    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.citasService.actualizarCita(id, cita).subscribe( (resp: any) => {
      Swal.close();
      Swal.fire(
        'Actualizada',
        'Cita ' + cita.titulo + ' actualizada',
        'success'
      );

      if (clickInfo !== null){
        const calendarApi = clickInfo.view.calendar;
        clickInfo.event.remove();
        calendarApi.addEvent({
          id: resp.cita.id,
          title: resp.cita.titulo,
          start: resp.cita.fecha,
          end: clickInfo.event.endStr,
          allDay: clickInfo.event.allDay
        });
      }

    }, err => {
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }

  eliminarCita(clickInfo: EventClickArg){
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Eliminar cita ' + clickInfo.event.title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon: 'warning',
          title: 'Espere por favor...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
              Swal.showLoading();
          },
        });

        this.citasService.eliminarCita(clickInfo.event.id).subscribe( resp => {
          Swal.close();
          Swal.fire(
            'Eliminada',
            'Cita ' + clickInfo.event.title + ' eliminada',
            'success'
          );

          clickInfo.event.remove();

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
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  cargarCitas(){
    this.citasService.getCitas(this.uid).subscribe( (resp: Cita[]) => {
      resp.forEach( (cita: Cita) => {
        const data: EventInput = {
          id: cita.id,
          title: cita.titulo,
          start: cita.fecha
        };
        this.initialEvents.push(data);
      });
      this.calendarOptions.events = this.initialEvents;
    });
  }

  handleDrop(event){
    const dataCita: Cita = {
      titulo: event.event.title,
      fecha: event.event.startStr
    };
    this.actualizarCita(event.event.id, dataCita, null);
  }

}
