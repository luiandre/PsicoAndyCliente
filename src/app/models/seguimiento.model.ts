import { NoticiaUser } from '../interfaces/noticia-user.interface';

export class Seguimiento {

    constructor(
        public paciente: NoticiaUser | string,
        public profesional: NoticiaUser | string,
        public fecha?: string,
        public fechaActualizacion?: number,
        public id?: string,
        public numero?: string,
        public actividad?: string,
        public observaciones?: string,
    ){}
}
