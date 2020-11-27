import { NoticiaUser } from '../interfaces/noticia-user.interface';

export class Comunicado {

    constructor(
        public titulo: string,
        public detalle: string,
        public fecha: number,
        public usuario: NoticiaUser | string,
        public id?: string,
    ){}
}