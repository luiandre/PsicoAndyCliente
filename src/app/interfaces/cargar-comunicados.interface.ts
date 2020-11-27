import { Comunicado } from '../models/comunicado.model';


export interface CargarComunicado {
    total: number;
    comunicados: Comunicado[];
}
