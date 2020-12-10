
import { ServicioUser } from '../interfaces/usuario-servicio.interface';
export class Asignacion {

    constructor(
        public paciente: ServicioUser | string,
        public profesional: ServicioUser | string,
        public usuario?: ServicioUser | string,
        public fecha?: number,
        public id?: string,
    ){}
}
