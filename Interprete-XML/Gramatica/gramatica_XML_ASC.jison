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
"'"                                                     return 'apost';

/* Number literals */

[^a-zA-Z_0-9ñÑ\-</>=\"?'~@#]+                             return 'contentH';
[a-zA-Z_][a-zA-Z0-9_ñÑ\-]*                              return 'identifier';
(([0-9]+"."[0-9]*)|("."[0-9]+))                         return 'double';
[0-9]+                                                  return 'integer';
{escape}                                                return 'Escape';

//error lexico
.                                   {
                                        erroresLexicos.push(new Error('Error Lexico en linea ' + yylloc.first_line + ' y columna: ' + yylloc.first_column + ': ' + yytext));
                                        //console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                    }

<<EOF>>                                                 return 'EOF';

/lex

//SECCION DE IMPORTS
%{
    const {Error} = require("../Errores/Error");
    const {Objeto, Etiqueta} = require("../Expresiones/Objeto");
    const {Atributo, Comilla} = require("../Expresiones/Atributo");

    var erroresSemanticos = [];
    var erroresLexicos = [];
    var reporteGramatical = [];

    function getClr(){
        return "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    }
%}

// DEFINIMOS PRODUCCIÓN INICIAL
%start START

%%


/* Definición de la gramática */
START : RAIZ EOF                                                               { 
                                                                                    reporteGramatical.push('<tr> <td>START</td> <td>RAIZ</td> </tr>');
                                                                                    $$ = { objeto: $1,
                                                                                        erroresSemanticos: erroresSemanticos,
                                                                                        erroresLexicos: erroresLexicos,
                                                                                        reporteGramatical: reporteGramatical
                                                                                        };
                                                                                    erroresLexicos = [];
                                                                                    erroresSemanticos = [];
                                                                                    reporteGramatical = [];
                                                                                    return $$;
                                                                               }
;

RAIZ:
    HEAD OBJETO                                                                {
                                                                                    $$ = [$1,$2];
                                                                                    reporteGramatical.push('<tr> <td>RAIZ</td> <td>HEAD OBJETO</td> </tr>');
                                                                               }
    | OBJETO                                                                   {
                                                                                    $$ = [$1];
                                                                                    reporteGramatical.push('<tr> <td>RAIZ</td> <td>OBJETO</td> </tr>');
                                                                               }
;

HEAD:
    lt qst xml LATRIBUTOS qst gt                                               {
                                                                                    $$ = new Objeto($3,'',@1.first_line, @1.first_column,$4,[],Etiqueta.HEADER);
                                                                                    reporteGramatical.push('<tr> <td>HEAD</td> <td>lt qst xml LATRIBUTOS qst gt</td> </tr>');
                                                                               }
;

OBJETO:
      lt identifier LATRIBUTOS gt OBJETOS           lt div identifier gt       {
                                                                                    $$ = new Objeto($2,'',@1.first_line, @1.first_column,$3,$5,Etiqueta.DOBLE);
                                                                                    if($2 !== $8){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + @1.first_line + ' y columna: ' + @1.first_column + ':  No coinciden las etiquetas de apertura y final. ' + $2 + ' y ' + $8 ));
                                                                                    }
                                                                                    reporteGramatical.push('<tr style="background:' + getClr() + ';"> <td>OBJETO</td> <td>lt identifier LATRIBUTOS gt OBJETOS lt div identifier gt</td> </tr>');
                                                                               }
    | lt identifier LATRIBUTOS gt                   lt div identifier gt       { 
                                                                                    $$ = new Objeto($2,'',@1.first_line, @1.first_column,$3,[],Etiqueta.DOBLE);
                                                                                    if($2 !== $7){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + @1.first_line + ' y columna: ' + @1.first_column + ':  No coinciden las etiquetas de apertura y final. ' + $2 + ' y ' + $7 ));
                                                                                    }
                                                                                    reporteGramatical.push('<tr style="background:' + getClr() + ';"> <td>OBJETO</td> <td>lt identifier LATRIBUTOS gt lt div identifier gt</td> </tr>');
                                                                               }
    | lt identifier LATRIBUTOS gt CONTENIDO_OBJ     lt div identifier gt       { 
                                                                                    $$ = new Objeto($2,$5,@1.first_line, @1.first_column,$3,[],Etiqueta.DOBLE); 
                                                                                    if($2 !== $8){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + @1.first_line + ' y columna: ' + @1.first_column + ':  No coinciden las etiquetas de apertura y final. ' + $2 + ' y ' + $8 ));
                                                                                    }
                                                                                    reporteGramatical.push('<tr style="background:' + getClr() + ';"> <td>OBJETO</td> <td>lt identifier LATRIBUTOS gt CONTENIDO_OBJ lt div identifier gt</td> </tr>');
                                                                               }
    | lt identifier LATRIBUTOS div gt                                          {
                                                                                    $$ = new Objeto($2,'',@1.first_line, @1.first_column,$3,[],Etiqueta.UNICA);
                                                                                    reporteGramatical.push('<tr style="background:' + getClr() + ';"> <td>OBJETO</td> <td>lt identifier LATRIBUTOS div gt</td> </tr>');
                                                                               }
;

OBJETOS:
      OBJETOS OBJETO                                                           {
                                                                                    $1.push($2); $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>OBJETOS</td> <td>OBJETOS OBJETO</td> </tr>');
                                                                               }
	| OBJETO                                                                   {
                                                                                    $$ = [$1];
                                                                                    reporteGramatical.push('<tr> <td>OBJETOS</td> <td>OBJETO</td> </tr>');
                                                                               }
;

LATRIBUTOS:
    ATRIBUTOS                                                                  {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>LATRIBUTOS</td> <td>ATRIBUTOS</td> </tr>');
                                                                               }
    |                                                                          {
                                                                                    $$ = [];
                                                                                    reporteGramatical.push('<tr> <td>LATRIBUTOS</td> <td>Epsilon</td> </tr>');
                                                                               }
;

ATRIBUTOS:
    ATRIBUTOS ATRIBUTO                                                         {
                                                                                    $1.push($2);
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>ATRIBUTOS</td> <td>ATRIBUTOS ATRIBUTO</td> </tr>');
                                                                               }
    | ATRIBUTO                                                                 {
                                                                                    $$ = [$1];
                                                                                    reporteGramatical.push('<tr> <td>ATRIBUTOS</td> <td>ATRIBUTO</td> </tr>');
                                                                               } 
;

ATRIBUTO: 
    identifier asig FIN_ATRIBUTO                                               {
                                                                                    $$ = new Atributo($1, $3.valor, @1.first_line, @1.first_column, $3.comilla);
                                                                                    reporteGramatical.push('<tr> <td>ATRIBUTO</td> <td>identifier asig FIN_ATRIBUTO</td> </tr>');
                                                                               }
;

FIN_ATRIBUTO:
    qmrk CONTENIDO_ATRB qmrk                                                   {
                                                                                    $$ = new Atributo($1, $2, @1.first_line, @1.first_column, Comilla.DOBLE);
                                                                                    reporteGramatical.push('<tr> <td>FIN_ATRIBUTO</td> <td>qmrk CONTENIDO_ATRB qmrk</td> </tr>');
                                                                               }
    | apost CONTENIDO_ATRB_SMPL apost                                          { 
                                                                                    $$ = new Atributo($1, $2, @1.first_line, @1.first_column, Comilla.SIMPLE);
                                                                                    reporteGramatical.push('<tr> <td>FIN_ATRIBUTO</td> <td>apost CONTENIDO_ATRB_SMPL apost</td> </tr>');
                                                                               }
;


/* CONTENIDO DE OBJETO*/

CONTENIDO_OBJ:
    CONTENIDO_OBJ VALUES_CONT_OBJ                                              {
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
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_OBJ</td> <td>CONTENIDO_OBJ VALUES_CONT_OBJ</td> </tr>');
                                                                               }
    | VALUES_CONT_OBJ                                                          {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_OBJ</td> <td>VALUES_CONT_OBJ</td> </tr>');
                                                                               }
;

VALUES_CONT_OBJ :
    VALUE                                                                      {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_OBJ</td> <td>VALUE</td> </tr>');
                                                                               }
    | qmrk                                                                     {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_OBJ</td> <td>qmrk</td> </tr>');
                                                                               }
    | apost                                                                    {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_OBJ</td> <td>apost</td> </tr>');
                                                                               }
;

/* CONTENIDO DE ATRIBUTO CON COMILLA DOBLE*/

CONTENIDO_ATRB :
    LISTA_CONT_ATRB                                                            {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_ATRB</td> <td>LISTA_CONT_ATRB</td> </tr>');
                                                                               }
    |                                                                          {
                                                                                    $$ = '';
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_ATRB</td> <td>Epsilon</td> </tr>');
                                                                               }
;

LISTA_CONT_ATRB:
    LISTA_CONT_ATRB VALUES_CONT_ATRB                                           {
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
                                                                                    reporteGramatical.push('<tr> <td>LISTA_CONT_ATRB</td> <td>LISTA_CONT_ATRB VALUES_CONT_ATRB</td> </tr>');
                                                                               }
    | VALUES_CONT_ATRB                                                         {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>LISTA_CONT_ATRB</td> <td>VALUES_CONT_ATRB</td> </tr>');
                                                                               }
;

VALUES_CONT_ATRB :
    VALUE                                                                      {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB</td> <td>VALUE</td> </tr>');
                                                                               }
    | lt                                                                       {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB</td> <td>lt</td> </tr>');
                                                                               }
    | apost                                                                    {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB</td> <td>apost</td> </tr>');
                                                                               }
;

/* CONTENIDO DE ATRIBUTO CON COMILLA SIMPLE*/

CONTENIDO_ATRB_SMPL :
    LISTA_CONT_ATRB_SMPL                                                       {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_ATRB_SMPL</td> <td>LISTA_CONT_ATRB_SMPL</td> </tr>');
                                                                               }
    |                                                                          {
                                                                                    $$ = '';
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_ATRB_SMPL</td> <td>Epsilon</td> </tr>');
                                                                               }
;

LISTA_CONT_ATRB_SMPL:
    LISTA_CONT_ATRB_SMPL VALUES_CONT_ATRB_SMPL                                 {
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
                                                                                    reporteGramatical.push('<tr> <td>LISTA_CONT_ATRB_SMPL</td> <td>LISTA_CONT_ATRB_SMPL VALUES_CONT_ATRB_SMPL</td> </tr>');
                                                                               }
    | VALUES_CONT_ATRB_SMPL                                                    {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>LISTA_CONT_ATRB_SMPL</td> <td>VALUES_CONT_ATRB_SMPL</td> </tr>');
                                                                               }
;

VALUES_CONT_ATRB_SMPL :
    VALUE                                                                      {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB_SMPL</td> <td>VALUE</td> </tr>');
                                                                               }
    | lt                                                                       {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB_SMPL</td> <td>lt</td> </tr>');
                                                                               }
    | qmrk                                                                     {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB_SMPL</td> <td>qmrk</td> </tr>');
                                                                               }
;

VALUE:
    identifier                                                                 {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>identifier</td> </tr>');
                                                                               }
    | contentH                                                                 {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>contentH</td> </tr>');
                                                                               }
    | div                                                                      {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>div</td> </tr>');
                                                                               }
    | gt                                                                       {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>gt</td> </tr>');
                                                                               }
    | asig                                                                     {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>asig</td> </tr>');
                                                                               }
    | double                                                                   {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>double</td> </tr>');
                                                                               }
    | integer                                                                  {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>integer</td> </tr>');
                                                                               }
    | qst                                                                      {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>qst</td> </tr>');
                                                                               }
    | xml                                                                      {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>xml</td> </tr>');
                                                                               }
    | minus                                                                    {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>minus</td> </tr>');
                                                                               }
    | Escape                                                                   {
                                                                                    $$ = $1;
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>Escape</td> </tr>');
                                                                               }
;