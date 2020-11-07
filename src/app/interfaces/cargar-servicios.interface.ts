import { Noticia } from '../models/noticia.model';
import { Servicio } from '../models/servicio.model';

export interface CargarServicio {
    total: number;
    servicios: Servicio[];
}
