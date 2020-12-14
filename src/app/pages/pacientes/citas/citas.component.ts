import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CitasService } from '../../../services/citas.service';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Cita } from '../../../models/cita.model';
import { element } from 'protractor';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  initialEvents: EventInput[] = [];

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
                private usuarioService: UsuarioService) {
                  this.uid = this.usuarioService.uid;
                }

  ngOnInit(): void {
    this.cargarCitas();
  }

  async handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    const { value: formValues } = await Swal.fire({
      showCancelButton: true,
      confirmButtonText: `Guardar`,
      cancelButtonText: `Cancelar`,
      title: 'Nueva Cita',
      html:
        '<b>Titulo:<b>' +
        '<input id="titulo" class="swal2-input">' +
        '<b>Detalle:<b>' +
        '<input id="detalle" class="swal2-input">' ,
        // +
        // '<b>Usuario:<b>' +
        // '<input id="paciente" class="swal2-input">',
      preConfirm: () => {
        const titulo: any = document.getElementById('titulo');
        const detalle: any = document.getElementById('detalle');
        // const paciente: any = document.getElementById('paciente');
        return [
          titulo.value,
          detalle.value,
          // paciente.value
        ];
      }
    });

    if (formValues){
      const cita: Cita = {
        titulo: formValues[0],
        detalle: formValues[1],
        paciente: this.uid,
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
          title: formValues[0],
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
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

  handleEventClick(clickInfo: EventClickArg) {
    this.citasService.getCita(clickInfo.event.id).subscribe(
      resp => {
        Swal.fire({
          showCancelButton: true,
          confirmButtonText: `Guardar`,
          cancelButtonText: `Cancelar`,
          showDenyButton: true,
          denyButtonText: `Eliminar`,
          title: 'Nueva Cita',
          html:
            '<b>Titulo:<b>' +
            '<input id="titulo" class="swal2-input" value="' + resp.titulo + '">' +
            '<b>Detalle:<b>' +
            '<input id="detalle" class="swal2-input" value="' + resp.detalle + '">',
          preConfirm: () => {
            const titulo: any = document.getElementById('titulo');
            const detalle: any = document.getElementById('detalle');
            return [
              titulo.value,
              detalle.value,
            ];
          }
        }).then(
          result => {
            if (result.isConfirmed) {
              const dataCita: Cita = {
                titulo: result.value[0],
                detalle: result.value[1]
              };
              this.actualizarCita(resp.id, dataCita, clickInfo);
            } else if (result.isDenied) {
              this.eliminarCita(clickInfo);
            }
          }
        );
      }
    );
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
