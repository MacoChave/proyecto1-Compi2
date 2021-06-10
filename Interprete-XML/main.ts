import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";

const xmlAsc = require('./Gramatica/gramatica_XML_ASC');

export class Main {

    ejecutarCodigo(entrada: any) {
        console.log('ejecutando parse ...');
        const objetos = xmlAsc.parse(entrada);
        console.log(objetos);
    }

    readFile(e: any) {
        console.log('read file ...');
        var file = e.target.files[0];
        if (!file)
            return;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            let target = e.target;
            if (target !== undefined && target !== null) {
                console.log('load text ...')
                var contents = target.result;
                var element = document.getElementById('codeBlock');
                if (element !== undefined && element !== null) {
                    element.textContent = contents;
                } else {
                    console.log('Error set content')
                }
            } else {
                console.log('Error read file')
            }
        };
        reader.readAsText(file);
    }

    prueba() {
        console.log("hola mundo");
    }

    setListener() {
        let inputFile = document.getElementById('open-file');
        if (inputFile !== undefined && inputFile !== null) {
            inputFile.addEventListener('change', this.readFile, false);
            console.log("inputFile activo");
        }

        let analizeXmlAsc = document.getElementById('analizeXmlAsc');
        if (analizeXmlAsc !== undefined && analizeXmlAsc !== null) {
            console.log("btn xmlAsc activo");
            analizeXmlAsc.addEventListener('click', () => {
                // ANALIZAR XML
                let codeBlock = document.getElementById('codeBlock');
                let content = codeBlock !== undefined && codeBlock !== null ? codeBlock.value : '';
                this.ejecutarCodigo(content);
            });
        }

        let clean = document.getElementById('clean');
        if (clean !== undefined && clean !== null) {
            console.log("btn clean activo");
            clean.addEventListener('click', () => {
                let codeBlock = document.getElementById('codeBlock');
                if (codeBlock !== undefined && codeBlock !== null) {
                    codeBlock.value = '';
                };
            });
        }
    }
}