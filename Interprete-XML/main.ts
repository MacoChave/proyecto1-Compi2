import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";

const xmlAsc = require('./Gramatica/gramatica_XML_ASC');
const xpathAsc = require('./Gramatica/xpathAsc');

export class Main {

    lexicos:any=[];

    ejecutarCodigoXmlAsc(entrada: any) {
        console.log('ejecutando xmlAsc ...');
        const objetos = xmlAsc.parse(entrada);
        console.log(objetos);
        window.localStorage.setItem('lexicos',JSON.stringify(objetos.erroresLexicos));
        //this.Errsemantico = objetos.erroresSemanticos;
        //console.log(this.Errsemantico);
        //console.log(objetos);
    }

    ejecutarCodigoXpathAsc(entrada: any) {
        console.log('ejecutando xpathAsc ...');
        const objetos = xpathAsc.parse(entrada);
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

    getErroresLexicos(){
        let lex = window.localStorage.getItem('lexicos');
        if (lex){
            this.lexicos =  JSON.parse(lex); 
            console.log(this.lexicos);

            var tbodyRef:any = document.getElementById('keywords');
            let i = 1;
            this.lexicos.forEach((element:any) => {
    
                let newRow = tbodyRef.insertRow();
                let newCell = newRow.insertCell();
                let newText2 = document.createTextNode(element.descripcion);
                newCell.appendChild(newText2);
            });
    

        }





        //setup our table array

    
        
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
                let codeBlock:any = document.getElementById('codeBlock');
                let content = codeBlock !== undefined && codeBlock !== null ? codeBlock.value : '';
                this.ejecutarCodigoXmlAsc(content);
            });
        }

        let analizeXPathAsc = document.getElementById('analizeXPathAsc');
        if (analizeXPathAsc !== undefined && analizeXPathAsc !== null) {
            console.log("btn xpathAsc activo");
            analizeXPathAsc.addEventListener('click', () => {
                // ANALIZAR XML
                let input:any = document.getElementById('codeXPath');
                let content = input !== undefined && input !== null ? input.value : '';
                this.ejecutarCodigoXpathAsc(content);
            });
        }

        let clean = document.getElementById('clean');
        if (clean !== undefined && clean !== null) {
            console.log("btn clean activo");
            clean.addEventListener('click', () => {
                let codeBlock:any = document.getElementById('codeBlock');
                if (codeBlock !== undefined && codeBlock !== null) {
                    codeBlock.value = '';
                };
            });
        }


        let tablaErrores = document.getElementById('tablaErrores');
        if (tablaErrores !== undefined && tablaErrores !== null) {
            console.log("btn Tabla Errores Activo");
            tablaErrores.addEventListener('click', () => {
                this.getErroresLexicos();
            });
        }
    }
}