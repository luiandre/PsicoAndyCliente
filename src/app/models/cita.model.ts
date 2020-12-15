import { NoticiaUser } from '../interfaces/noticia-user.interface';

export class Cita {

    constructor(
        public titulo: string,
        public fecha?: string,
        public usuario?: NoticiaUser | string,
        public paciente?: NoticiaUser | string,
        public id?: string,
    ){}
}
