import { MensajeUser } from '../interfaces/MensajeUser.interface';
export class Mensaje {
    constructor(
        public de: any | MensajeUser,
        public para: any | MensajeUser,
        public mensaje: string,
        public fecha?: string,
        public id?: string,
        public pendiente?: boolean
    ){}
}
