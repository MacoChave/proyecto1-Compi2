/* Definición Léxica */
%lex

%options case-insensitive
%x Etiqueta

escapechar                                              [\'\"\\bfnrtv]
escape                                                  \\{escapechar}
acceptedcharsdouble                                     [^\"\\]+
stringdouble                                            {escape}|{acceptedcharsdouble}
stringliteral                                           \"{stringdouble}*\"

BSL                                                     "\\".
%s                                                      comment
%%

"<!--"                                                  this.begin('comment');
<comment>"-->"                                          this.popState();
<comment>.                                              /* skip comment content*/
\s+                                                     /* skip whitespace */

"/"                                                     return 'div';
"<"                                                     return 'lt';
">"                                                     return 'gt';
"="                                                     return 'asig';
"?"                                                     return 'qst';
"xml"                                                   return 'xml';

/* Number literals */

[^a-zA-Z_0-9ñÑ\-</>=\"?]+                               return 'contentH';
[a-zA-Z_][a-zA-Z0-9_ñÑ\-]*                              return 'identifier';
(([0-9]+"."[0-9]*)|("."[0-9]+))                         return 'double';
[0-9]+                                                  return 'integer';
{stringliteral}                                         return 'StringLiteral';

//error lexico
.                                   {
                                        console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                    }

<<EOF>>                                                 return 'EOF'

/lex

//SECCION DE IMPORTS
%{
    const {Print} = require("../Instrucciones/Primitivas/Print");
    const {Primitivo} = require("../Expresiones/Primitivo");
    const {Operacion, Operador} = require("../Expresiones/Operacion");
    const {Objeto} = require("../Expresiones/Objeto");
    const {Atributo} = require("../Expresiones/Atributo");
%}

// DEFINIMOS PRODUCCIÓN INICIAL
%start START

%%


/* Definición de la gramática */
START : RAIZ EOF                                                            
;

RAIZ:
    HEAD OBJETO                                                                
    | OBJETO                                                                   
;

HEAD:
    lt qst xml LATRIBUTOS qst gt                                           
;

OBJETO: INICIO FIN
;

INICIO: '<' identifier LATRIBUTOS
;


FIN: '>' CONTENT '<' '\' identifier '>'
    | '\' '>' 
;


CONTENT : OBJETOS
        | LISTA_ID_OBJETO
;



OBJETOS:
      OBJETO OBJETOS
      |                                                       
;



LATRIBUTOS: ATRIBUTOS                                                         
    |                                                                         
;

ATRIBUTOS:
    ATRIBUTO ATRIBUTOSP                                                       
    
;
ATRIBUTOSP: 
    ATRIBUTO ATRIBUTOSP                                                       
    |                                                                        
;



ATRIBUTO: 
    identifier asig StringLiteral                                              
;




LISTA_ID_OBJETO:  VALUE  LISTA_ID_OBJETOP                                         
;

LISTA_ID_OBJETOP: VALUE LISTA_ID_OBJETOP 
|                                                                               
;                                                                            



VALUE:
    identifier                                                                
    | contentH                                                          
    | div                                                               
    | gt                                                                     
    | asig                                                     
    | double                                                           
    | integer                                                 
    | qst                                                                 
    | xml                                                                       
;