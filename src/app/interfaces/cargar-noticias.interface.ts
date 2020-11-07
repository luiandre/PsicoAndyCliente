import { Noticia } from '../models/noticia.model';

export interface CargarNoticia {
    total: number;
    noticias: Noticia[];
}
