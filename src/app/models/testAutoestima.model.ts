import { NoticiaUser } from '../interfaces/noticia-user.interface';

export class TestAutoestima {

    constructor(
        public usuario: NoticiaUser | string,
        public fecha?: number,
        public id?: string,
        public group1?: string,
        public group2?: string,
        public group3?: string,
        public group4?: string,
        public group5?: string,
        public group6?: string,
        public group7?: string,
        public group8?: string,
        public group9?: string,
        public group10?: string,
        public total?: string,
    ){}
}
