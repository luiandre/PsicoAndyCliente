import { NoticiaUser } from '../interfaces/noticia-user.interface';

export class Noticia {

    constructor(
        public titulo: string,
        public detalle: string,
        public fecha: number,
        public usuario: NoticiaUser | string,
        public id?: string,
        public img?: string,
    ){}
}
