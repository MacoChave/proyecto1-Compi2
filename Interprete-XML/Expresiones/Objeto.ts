import { Atributo } from "./Atributo";

export enum Etiqueta {
    UNICA,
    DOBLE,
    HEADER
}

export class Objeto{
    identificador:string;
    texto:string;
    listaAtributos:Array<Atributo>;
    listaObjetos: Array<Objeto>;
    linea: number;
    columna: number;
    etiqueta: Etiqueta;

    constructor(id:string, texto:string, linea:number, columna:number, listaAtributos:Array<Atributo>, listaO:Array<Objeto>, etiqueta){
        this.identificador = id;
        this.texto = texto;
        this.linea = linea;
        this.columna = columna;
        this.listaAtributos = listaAtributos;
        this.listaObjetos = listaO
        this.etiqueta = etiqueta;
    }
}