import { Seguimiento } from '../models/seguimiento.model';

export interface CargarSeguimiento {
    total: number;
    seguimientos: Seguimiento[];
}
