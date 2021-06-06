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
START : RAIZ EOF                                                               { $$ = $1; return $$; }
;

RAIZ:
    HEAD OBJETO                                                                { $$ = [$1,$2]; }
    | OBJETO                                                                   { $$ = [$1]; }
;

HEAD:
    lt qst xml LATRIBUTOS qst gt                                               { $$ = new Objeto($3,'',@1.first_line, @1.first_column,$4,[]); }
;

OBJETO:
      lt identifier LATRIBUTOS gt OBJETOS           lt div identifier gt       { $$ = new Objeto($2,'',@1.first_line, @1.first_column,$3,$5); }
    | lt identifier LATRIBUTOS gt                   lt div identifier gt       { $$ = new Objeto($2,'',@1.first_line, @1.first_column,$3,[]); }
    | lt identifier LATRIBUTOS gt LISTA_ID_OBJETO   lt div identifier gt       { $$ = new Objeto($2,$5,@1.first_line, @1.first_column,$3,[]); }
    | lt identifier LATRIBUTOS div gt                                          { $$ = new Objeto($2,'',@1.first_line, @1.first_column,$3,[]); }
;

OBJETOS:
      OBJETOS OBJETO                                                           { $1.push($2); $$ = $1;}
	| OBJETO                                                                   { $$ = [$1]; }
;

LATRIBUTOS: ATRIBUTOS                                                          { $$ = $1; }
    |                                                                          { $$ = []; }
;

ATRIBUTOS:
    ATRIBUTOS ATRIBUTO                                                         { $1.push($2); $$ = $1;}
    | ATRIBUTO                                                                 { $$ = [$1]; } 
;

ATRIBUTO: 
    identifier asig StringLiteral                                              { $$ = new Atributo($1, $3, @1.first_line, @1.first_column); }
;

LISTA_ID_OBJETO: LISTA_ID_OBJETO VALUE                                         {
                                                                                        if(@1.last_line == @2.first_line){ 
                                                                                            if(@1.last_column < @2.first_column ){
                                                                                                for(let i = 0, size = @2.first_column - @1.last_column; i < size; i++ ){
                                                                                                    $1 = $1 + ' ';
                                                                                                }
                                                                                            }
                                                                                        } else {
                                                                                            for(let i = 0, size = @2.first_line - @1.last_line; i < size; i++ ){
                                                                                                $1 = $1 + '\n';
                                                                                            }
                                                                                        }
                                                                                        $1 = $1 + $2;
                                                                                        $$ = $1;
                                                                                }
        | VALUE                                                                 { $$ = $1 }
;

VALUE:
    identifier                                                                  { $$ = $1 }
    | contentH                                                                  { $$ = $1 }
    | div                                                                       { $$ = $1 }
    | gt                                                                        { $$ = $1 }
    | asig                                                                      { $$ = $1 }
    | double                                                                    { $$ = $1 }
    | integer                                                                   { $$ = $1 }
    | qst                                                                       { $$ = $1 }
    | xml                                                                       { $$ = $1 }
;