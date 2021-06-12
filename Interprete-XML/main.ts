import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";


const xmlAsc = require('./Gramatica/gramatica_XML_ASC');
const xpathAsc = require('./Gramatica/xpathAsc');

export class Main {

    lexicos:any=[];
    lista_objetos:any=[];
    lista_objetos_xpath:any=[];
    nodos:any=[];
    edges:any=[];
    i:number=1;
    nodoxpath:any=[];
    edgesxpath:any=[];

    ejecutarCodigoXmlAsc(entrada: any) {
        console.log('ejecutando xmlAsc ...');
       
        const objetos = xmlAsc.parse(entrada);
        this.lista_objetos=objetos.objeto;
        console.log(this.lista_objetos)
        window.localStorage.setItem('lexicos',JSON.stringify(objetos.erroresLexicos));
        //this.Errsemantico = objetos.erroresSemanticos;
        //console.log(this.Errsemantico);
        //console.log(objetos);
    }

    ejecutarCodigoXpathAsc(entrada: any) {
        console.log('ejecutando xpathAsc ...');
        const objetos = xpathAsc.parse(entrada);
        this.lista_objetos_xpath = objetos.Nodo;
        console.log(this.lista_objetos_xpath);


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

    graficar(){
        this.i =1;
        this.nodos=[];
        this.edges=[];
        
        let aux = {
            'id':1, 
            'label':"s"
        }
        this.nodos.push(aux);

        this.lista_objetos.forEach((element:any) => {
           // console.log(element.identificador);


            this.i++;
            let padre =this.i;
            let aux = {
                'id':padre, 
                'label':element.identificador
            }
            this.nodos.push(aux);
            let aux2 = {
                'from': 1, 
                'to': this.i
            }
            

            this.edges.push(aux2);
            this.getObjetos(element.listaObjetos,padre);
            if(element.listaAtributos){
                this.getAtributos(element.listaAtributos,padre);
            }

            
        });

        window.localStorage.setItem('nodos',JSON.stringify(this.nodos))
        window.localStorage.setItem('edges',JSON.stringify(this.edges))

        console.log(this.nodos);
        console.log(this.edges);
    }

    getAtributos(listaObjeto:any,padre:number){
        listaObjeto.forEach((element:any) => {
            this.i++;
            let hijo=this.i;
            let aux = {
                'id':hijo, 
                'label':element.identificador
            }
            let aux2 = {
                'from': padre, 
                'to': hijo
            }
            this.nodos.push(aux);
            this.edges.push(aux2);
            
            if(element.textWithoutSpecial!=""){
                this.i++;
                aux={
                    'id':this.i,
                    'label':element.textWithoutSpecial
                }
                aux2= {
                    'from': hijo,
                    'to':  this.i
                }

                this.nodos.push(aux);
                this.edges.push(aux2);
            
            }

            
        });

    }

    getObjetos(listaObjeto:any,padre:number){
        
        listaObjeto.forEach((element:any) => {
            this.i++;
            let hijo = this.i;
            let aux = {
                'id':this.i, 
                'label':element.identificador
            }
            let aux2 = {
                'from': padre, 
                'to': this.i
            }
            

            this.nodos.push(aux);
            this.edges.push(aux2);


            if(element.textWithoutSpecial!=""){
                this.i++;
                aux={
                    'id':this.i,
                    'label':element.textWithoutSpecial
                }
                aux2= {
                    'from': hijo,
                    'to':  this.i
                }

                this.nodos.push(aux);
                this.edges.push(aux2);
            
            }





            this.getObjetos(element.listaObjetos,this.i);

            if(element.listaAtributos){
                this.getAtributos(element.listaAtributos,hijo);
            }
            
            

            
        });

    }

    arbolXpath(){
        this.i=1;
        this.nodoxpath=[];
        this.edgesxpath=[];
        
        let aux = {
            'id':1, 
            'label':"s"
        }
        this.nodoxpath.push(aux);

        let element =  this.lista_objetos_xpath
        console.log(element);
        console.log(element.val);


            this.i++;
            let padre =this.i;
             aux = {
                'id':padre, 
                'label':element.val
            }
            this.nodoxpath.push(aux);
            let aux2 = {
                'from': 1, 
                'to': this.i
            }
            

            this.edgesxpath.push(aux2);
            this.getObjetosXpath(element.children,padre);


   

        window.localStorage.setItem('nodosxpath',JSON.stringify(this.nodoxpath))
        window.localStorage.setItem('edgesxpath',JSON.stringify(this.edgesxpath))

        console.log(this.nodoxpath);
        console.log(this.edgesxpath);

    }

    getObjetosXpath(listaObjeto:any, padre:number){
        listaObjeto.forEach((element:any) => {
            
            if(element!=undefined){
                this.i++;
                let hijo = this.i;
                let aux = {
                    'id':this.i, 
                    'label':element.val
                }
                let aux2 = {
                    'from': padre, 
                    'to': this.i
                }
                
    
                this.nodoxpath.push(aux);
                this.edgesxpath.push(aux2);
    
                this.getObjetosXpath(element.children,this.i);

            }



        
            
        });
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
                this.graficar();
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
                this.arbolXpath();
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