import { ServicioResponsable } from '../interfaces/responsable-servicio.interface';
import { ServicioUser } from '../interfaces/usuario-servicio.interface';
export class Servicio {

    constructor(
        public usuario: ServicioUser | string,
        public titulo: string,
        public detalle: string,
        public fecha: number,
        public responsable: ServicioResponsable,
        public img?: string,
        public id?: string,
    ){}
}
