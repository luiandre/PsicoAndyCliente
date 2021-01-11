
export class Sala {

    constructor(
        public uuid: string,
        public origen: string,
        public destino: string,
        public conOrigen?: boolean,
        public conDestino?: boolean
    ){}
}
