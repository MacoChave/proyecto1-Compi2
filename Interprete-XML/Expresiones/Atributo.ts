export class Atributo{
    identificador:string;
    valor:string;
    linea: number;
    columna: number;

    constructor(id:string, valor:string, linea:number, columna:number){
        this.identificador = id;
        this.valor = valor.split('"').join('');
        this.linea = linea;
        this.columna = columna;
    }
}