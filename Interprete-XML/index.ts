import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";

const gramatica = require('./Gramatica/gramatica');

function ejecutarCodigo(entrada: string) {
    const objetos = gramatica.parse(entrada);
    const entornoGlobal: Entorno = new Entorno(null);
    //const ast:AST = new AST(instrucciones);
    //instrucciones.forEach((element:Instruccion) => {
    //    element.ejecutar(entornoGlobal,ast);
    //});
}

ejecutarCodigo(`
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <!---->
  <body>
    Don't      forget me this weekend!
    Hola como están

    Bien y tú?    !esto es un msj¡ #hola  xml xmlasb asfsxml


    24.5 no y si tal vez % 

  </body>
  <abc>58.5</abc>
  <fgh/>
  <hola></hola>
  <bookstore xmlns="http://www.w3.org/2001/XMLSchema-instance"
           noNamespaceSchemaLocation="BookStore.xsd">
    <book price="730.54" ISBN="string" publicationdate="2016-02-27">
        <title>string</title>
        <author>
            <first-name>string</first-name>
            <last-name>string</last-name>
        </author>
        <genre>string</genre>
    </book>
    <book price="6738.774" ISBN="
    
    string " abc=""
    >
        <!-- -->
        <title><!-- -->string<!-- --></title>
        <author><!-- -->
            <first-name>string</first-name>
            <last-name>string</last-name><!-- -->
        </author>
    </book>
</bookstore>
</note>
`);