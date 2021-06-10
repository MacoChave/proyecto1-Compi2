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
"-"                                                     return 'minus';
"xml"                                                   return 'xml';
"\""                                                    return 'qmrk';

/* Number literals */

[^a-zA-Z_0-9ñÑ\-</>=\"?]+                               return 'contentH';
[a-zA-Z_][a-zA-Z0-9_ñÑ\-]*                              return 'identifier';
(([0-9]+"."[0-9]*)|("."[0-9]+))                         return 'double';
[0-9]+                                                  return 'integer';
{escape}                                                return 'Escape';
/*{stringdouble}                                          return 'StringLiteral';*/

/*{less_than}                                             return 'lessThan';
{greater_than}                                          return 'greaterThan';
{ampersand}                                             return 'ampersand';
{apostrophe}                                            return 'apostrophe';
{quotation_mark}                                        return 'quotationMark';*/

//error lexico
.                                   {
                                        console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                    }

<<EOF>>                                                 return 'EOF';

/lex

//SECCION DE IMPORTS
%{
    const {Print} = require("../Instrucciones/Primitivas/Print");
    const {Primitivo} = require("../Expresiones/Primitivo");
    const {Operacion, Operador} = require("../Expresiones/Operacion");
    const {Objeto, Etiqueta} = require("../Expresiones/Objeto");
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

OBJETO:
      lt identifier LATRIBUTOS gt OBJETOS           lt div identifier gt      
    | lt identifier LATRIBUTOS gt                   lt div identifier gt       
    | lt identifier LATRIBUTOS gt CONTENIDO_OBJ     lt div identifier gt       
    | lt identifier LATRIBUTOS div gt                                          
;


OBJETOS: OBJETO OBJETOSP
;

OBJETOSP: OBJETO OBJETOSP
|;


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
    identifier asig qmrk CONTENIDO_ATRB qmrk                                   
;


CONTENIDO_OBJ:
    VALUES_CONT_OBJ CONTENIDO_OBJP
;

CONTENIDO_OBJP:
    VALUES_CONT_OBJ CONTENIDO_OBJP
    |
;


VALUES_CONT_OBJ :
    VALUE                                                                    
    | qmrk                                                                   
;

CONTENIDO_ATRB :
    LISTA_CONT_ATRB                                                           
    |                                                                       
;


LISTA_CONT_ATRB:
    VALUES_CONT_ATRB LISTA_CONT_ATRBP
;

LISTA_CONT_ATRBP:
    VALUES_CONT_ATRB LISTA_CONT_ATRBP
    |
;


VALUES_CONT_ATRB :
    VALUE                                                                      
    | lt                                                                     
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
    | minus                                                                 
    | Escape                                                               
;