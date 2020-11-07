import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

export class Usuario {
    constructor(
        public nombre: string,
        public apellido: string,
        public email: string,
        public password?: string,
        public google?: boolean,
        public activo?: boolean,
        public img?: string,
        public rol?: 'ADMIN_ROL' | 'PROF_ROL' | 'USER_ROL',
        public bio?: string,
        public uid?: string,
        public estado?: boolean,
        public conexiones?: number,
        public terminos?: boolean
    ){}

    get imagenUrl() {

        if (!this.img) {
            return `${ base_url }/upload/usuarios/no-image`;
        } else if (this.img.includes('https')){
            return this.img;
        } else if ( this.img){
            return `${ base_url }/upload/usuarios/${ this.img}`;
        } else {
            return `${ base_url }/upload/usuarios/no-image`;
        }
    }
}
