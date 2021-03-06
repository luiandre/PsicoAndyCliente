import { NoticiaUser } from '../interfaces/noticia-user.interface';

export class Historia {

    constructor(
        public usuario?: NoticiaUser | string,
        public entrevistador?: NoticiaUser | string,
        public email?: string,
        public fecha?: number,
        public id?: string,
        public numero?: string,
        public nombres?: string,
        public apellidos?: string,
        public fechaNacimiento?: string,
        public lugarNacimiento?: string,
        public sexo?: string,
        public religion?: string,
        public nacionalidad?: string,
        public provincia?: string,
        public ciudad?: string,
        public direccion?: string,
        public cambioDomicilio?: boolean,
        public motivo?: string,
        public instruccion?: string,
        public ocupacion?: string,
        public estadoCivil?: string,
        public conyuge?: string,
        public nHijos?: number,
        public convecional?: string,
        public celular?: string,
        public nombreEmergencia?: string,
        public telefonoEmergencia?: string,
        public direccionEmergencia?: string,
        public nombreAcompañante?: string,
        public motivoConsulta?: string,
        public factoresEpisodioActual?: string,
        public historiaEnfermedad?: string,
        public natal?: string,
        public infancia?: string,
        public pubertad?: string,
        public familiar?: string,
        public social?: string,
        public laboral?: string,
        public psicosexual?: string,
        public conciencia?: string,
        public voluntad?: string,
        public atencion?: string,
        public sensopercepciones?: string,
        public afectividad?: string,
        public pensamiento?: string,
        public memoria?: string,
        public aplicacionPruebas?: string,
        public diagnostico?: string,
        public tratamiento?: string,
    ){}
}
