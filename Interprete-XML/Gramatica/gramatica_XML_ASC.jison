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
    const {Nodo} = require("../AST/Nodo");
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
                                                                                    $$ = { objeto: $1.objeto,
                                                                                        nodos: $1.nodo,
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
                                                                                    $$ = { nodo: new Nodo('RAIZ',[$1.nodo,$2.nodo]), objeto: [$1.objeto,$2.objeto]};
                                                                                    reporteGramatical.push('<tr> <td>RAIZ</td> <td>HEAD OBJETO</td> </tr>');
                                                                               }
    | OBJETO                                                                   {
                                                                                    $$ = { nodo: new Nodo('RAIZ',[$1.nodo]), objeto: [$1.objeto]};
                                                                                    reporteGramatical.push('<tr> <td>RAIZ</td> <td>OBJETO</td> </tr>');
                                                                               }
;

HEAD:
    lt qst xml LATRIBUTOS qst gt                                               {
                                                                                    $$ = { nodo: new Nodo('HEAD',[new Nodo('lt',[]),new Nodo('qst',[]),new Nodo('xml',[]),$4.nodo,new Nodo('qst',[]),new Nodo('gt',[]) ]), objeto: new Objeto($3,'',@1.first_line, @1.first_column,$4.objeto,[],Etiqueta.HEADER)};
                                                                                    reporteGramatical.push('<tr> <td>HEAD</td> <td>lt qst xml LATRIBUTOS qst gt</td> </tr>');
                                                                               }
;

OBJETO:
      lt identifier LATRIBUTOS gt OBJETOS           lt div identifier gt       {
                                                                                    $$ = { nodo: new Nodo('OBJETO',[new Nodo('lt',[]),new Nodo('identifier',[]),$3.nodo,new Nodo('gt',[]),$5.nodo,new Nodo('lt',[]),new Nodo('div',[]),new Nodo('identifier',[]),new Nodo('gt',[]) ]), objeto: new Objeto($2,'',@1.first_line, @1.first_column,$3.objeto,$5.objeto,Etiqueta.DOBLE)};
                                                                                    if($2 !== $8){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + @1.first_line + ' y columna: ' + @1.first_column + ':  No coinciden las etiquetas de apertura y final. ' + $2 + ' y ' + $8 ));
                                                                                    }
                                                                                    reporteGramatical.push('<tr style="background:' + getClr() + ';"> <td>OBJETO</td> <td>lt identifier LATRIBUTOS gt OBJETOS lt div identifier gt</td> </tr>');
                                                                               }
    | lt identifier LATRIBUTOS gt                   lt div identifier gt       { 
                                                                                    $$ = { nodo: new Nodo('OBJETO',[new Nodo('lt',[]),new Nodo('identifier',[]),$3.nodo,new Nodo('gt',[]),new Nodo('lt',[]),new Nodo('div',[]),new Nodo('identifier',[]),new Nodo('gt',[]) ]), objeto: new Objeto($2,'',@1.first_line, @1.first_column,$3.objeto,[],Etiqueta.DOBLE)};
                                                                                    if($2 !== $7){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + @1.first_line + ' y columna: ' + @1.first_column + ':  No coinciden las etiquetas de apertura y final. ' + $2 + ' y ' + $7 ));
                                                                                    }
                                                                                    reporteGramatical.push('<tr style="background:' + getClr() + ';"> <td>OBJETO</td> <td>lt identifier LATRIBUTOS gt lt div identifier gt</td> </tr>');
                                                                               }
    | lt identifier LATRIBUTOS gt CONTENIDO_OBJ     lt div identifier gt       { 
                                                                                    $$ = { nodo: new Nodo('OBJETO',[new Nodo('lt',[]),new Nodo('identifier',[]),$3.nodo,new Nodo('gt',[]),$5.nodo,new Nodo('lt',[]),new Nodo('div',[]),new Nodo('identifier',[]),new Nodo('gt',[]) ]), objeto: new Objeto($2,$5.objeto,@1.first_line,@1.first_column,$3.objeto,[],Etiqueta.DOBLE)};
                                                                                    if($2 !== $8){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + @1.first_line + ' y columna: ' + @1.first_column + ':  No coinciden las etiquetas de apertura y final. ' + $2 + ' y ' + $8 ));
                                                                                    }
                                                                                    reporteGramatical.push('<tr style="background:' + getClr() + ';"> <td>OBJETO</td> <td>lt identifier LATRIBUTOS gt CONTENIDO_OBJ lt div identifier gt</td> </tr>');
                                                                               }
    | lt identifier LATRIBUTOS div gt                                          {
                                                                                    $$ = { nodo: new Nodo('OBJETO',[new Nodo('lt',[]),new Nodo('identifier',[]),$3.nodo,new Nodo('div',[]),new Nodo('gt',[]) ]), objeto: new Objeto($2,'',@1.first_line, @1.first_column,$3.objeto,[],Etiqueta.UNICA)};
                                                                                    reporteGramatical.push('<tr style="background:' + getClr() + ';"> <td>OBJETO</td> <td>lt identifier LATRIBUTOS div gt</td> </tr>');
                                                                               }
;

OBJETOS:
      OBJETOS OBJETO                                                           {
                                                                                    $1.objeto.push($2.objeto);
                                                                                    $$ = { nodo: new Nodo('OBJETOS',[$1.nodo,$2.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>OBJETOS</td> <td>OBJETOS OBJETO</td> </tr>');
                                                                               }
	| OBJETO                                                                   {
                                                                                    $$ = { nodo: new Nodo('OBJETOS',[$1.nodo]), objeto: [$1.objeto]};
                                                                                    reporteGramatical.push('<tr> <td>OBJETOS</td> <td>OBJETO</td> </tr>');
                                                                               }
;

LATRIBUTOS:
    ATRIBUTOS                                                                  {
                                                                                    $$ = { nodo: new Nodo('LATRIBUTOS',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>LATRIBUTOS</td> <td>ATRIBUTOS</td> </tr>');
                                                                               }
    |                                                                          {
                                                                                    $$ = { nodo: new Nodo('LATRIBUTOS',[new Nodo('EpSiLoN',[])]), objeto: []};
                                                                                    reporteGramatical.push('<tr> <td>LATRIBUTOS</td> <td>Epsilon</td> </tr>');
                                                                               }
;

ATRIBUTOS:
    ATRIBUTOS ATRIBUTO                                                         {
                                                                                    $1.objeto.push($2.objeto);
                                                                                    $$ = { nodo: new Nodo('ATRIBUTOS',[$1.nodo,$2.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>ATRIBUTOS</td> <td>ATRIBUTOS ATRIBUTO</td> </tr>');
                                                                               }
    | ATRIBUTO                                                                 {
                                                                                    $$ = { nodo: new Nodo('ATRIBUTOS',[$1.nodo]), objeto: [$1.objeto]};
                                                                                    reporteGramatical.push('<tr> <td>ATRIBUTOS</td> <td>ATRIBUTO</td> </tr>');
                                                                               } 
;

ATRIBUTO: 
    identifier asig FIN_ATRIBUTO                                               {
                                                                                    $$ = { nodo: new Nodo('ATRIBUTO',[new Nodo('identifier',[]),new Nodo('asig',[]),$3.nodo]), objeto: new Atributo($1, $3.objeto.valor, @1.first_line, @1.first_column, $3.objeto.comilla)};
                                                                                    reporteGramatical.push('<tr> <td>ATRIBUTO</td> <td>identifier asig FIN_ATRIBUTO</td> </tr>');
                                                                               }
;

FIN_ATRIBUTO:
    qmrk CONTENIDO_ATRB qmrk                                                   {
                                                                                    $$ = { nodo: new Nodo('FIN_ATRIBUTO',[new Nodo('qmrk',[]),$2.nodo,new Nodo('qmrk',[])]), objeto: new Atributo('', $2.objeto, @1.first_line, @1.first_column, Comilla.DOBLE)};
                                                                                    reporteGramatical.push('<tr> <td>FIN_ATRIBUTO</td> <td>qmrk CONTENIDO_ATRB qmrk</td> </tr>');
                                                                               }
    | apost CONTENIDO_ATRB_SMPL apost                                          { 
                                                                                    $$ = { nodo: new Nodo('FIN_ATRIBUTO',[new Nodo('apost',[]),$2.nodo,new Nodo('apost',[])]), objeto: new Atributo('', $2.objeto, @1.first_line, @1.first_column, Comilla.SIMPLE)};
                                                                                    reporteGramatical.push('<tr> <td>FIN_ATRIBUTO</td> <td>apost CONTENIDO_ATRB_SMPL apost</td> </tr>');
                                                                               }
;


/* CONTENIDO DE OBJETO*/

CONTENIDO_OBJ:
    CONTENIDO_OBJ VALUES_CONT_OBJ                                              {
                                                                                    if(@1.last_line == @2.first_line){ 
                                                                                        if(@1.last_column < @2.first_column ){
                                                                                            for(let i = 0, size = @2.first_column - @1.last_column; i < size; i++ ){
                                                                                                $1.objeto = $1.objeto + ' ';
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        for(let i = 0, size = @2.first_line - @1.last_line; i < size; i++ ){
                                                                                            $1.objeto = $1.objeto + '\n';
                                                                                        }
                                                                                    }
                                                                                    $1.objeto = $1.objeto + $2.objeto;
                                                                                    $$ = { nodo: new Nodo('CONTENIDO_OBJ',[$1.nodo,$2.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_OBJ</td> <td>CONTENIDO_OBJ VALUES_CONT_OBJ</td> </tr>');
                                                                               }
    | VALUES_CONT_OBJ                                                          {
                                                                                    $$ = { nodo: new Nodo('CONTENIDO_OBJ',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_OBJ</td> <td>VALUES_CONT_OBJ</td> </tr>');
                                                                               }
;

VALUES_CONT_OBJ :
    VALUE                                                                      {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_OBJ',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_OBJ</td> <td>VALUE</td> </tr>');
                                                                               }
    | qmrk                                                                     {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_OBJ',[new Nodo('qmrk',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_OBJ</td> <td>qmrk</td> </tr>');
                                                                               }
    | apost                                                                    {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_OBJ',[new Nodo('apost',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_OBJ</td> <td>apost</td> </tr>');
                                                                               }
;

/* CONTENIDO DE ATRIBUTO CON COMILLA DOBLE*/

CONTENIDO_ATRB :
    LISTA_CONT_ATRB                                                            {
                                                                                    $$ = { nodo: new Nodo('CONTENIDO_ATRB',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_ATRB</td> <td>LISTA_CONT_ATRB</td> </tr>');
                                                                               }
    |                                                                          {
                                                                                    $$ = { nodo: new Nodo('CONTENIDO_ATRB',[new Nodo('EpSiLoN',[])]), objeto: ''};
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_ATRB</td> <td>Epsilon</td> </tr>');
                                                                               }
;

LISTA_CONT_ATRB:
    LISTA_CONT_ATRB VALUES_CONT_ATRB                                           {
                                                                                    if(@1.last_line == @2.first_line){ 
                                                                                        if(@1.last_column < @2.first_column ){
                                                                                            for(let i = 0, size = @2.first_column - @1.last_column; i < size; i++ ){
                                                                                                $1.objeto = $1.objeto + ' ';
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        for(let i = 0, size = @2.first_line - @1.last_line; i < size; i++ ){
                                                                                            $1.objeto = $1.objeto + '\n';
                                                                                        }
                                                                                    }
                                                                                    $1.objeto = $1.objeto + $2.objeto;
                                                                                    $$ = { nodo: new Nodo('LISTA_CONT_ATRB',[$1.nodo,$2.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>LISTA_CONT_ATRB</td> <td>LISTA_CONT_ATRB VALUES_CONT_ATRB</td> </tr>');
                                                                               }
    | VALUES_CONT_ATRB                                                         {
                                                                                    $$ = { nodo: new Nodo('LISTA_CONT_ATRB',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>LISTA_CONT_ATRB</td> <td>VALUES_CONT_ATRB</td> </tr>');
                                                                               }
;

VALUES_CONT_ATRB :
    VALUE                                                                      {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_ATRB',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB</td> <td>VALUE</td> </tr>');
                                                                               }
    | lt                                                                       {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_ATRB',[new Nodo('lt',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB</td> <td>lt</td> </tr>');
                                                                               }
    | apost                                                                    {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_ATRB',[new Nodo('apost',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB</td> <td>apost</td> </tr>');
                                                                               }
;

/* CONTENIDO DE ATRIBUTO CON COMILLA SIMPLE*/

CONTENIDO_ATRB_SMPL :
    LISTA_CONT_ATRB_SMPL                                                       {
                                                                                    $$ = { nodo: new Nodo('CONTENIDO_ATRB_SMPL',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_ATRB_SMPL</td> <td>LISTA_CONT_ATRB_SMPL</td> </tr>');
                                                                               }
    |                                                                          {
                                                                                    $$ = { nodo: new Nodo('CONTENIDO_ATRB_SMPL',[new Nodo('EpSiLoN',[])]), objeto: ''};
                                                                                    reporteGramatical.push('<tr> <td>CONTENIDO_ATRB_SMPL</td> <td>Epsilon</td> </tr>');
                                                                               }
;

LISTA_CONT_ATRB_SMPL:
    LISTA_CONT_ATRB_SMPL VALUES_CONT_ATRB_SMPL                                 {
                                                                                    if(@1.last_line == @2.first_line){ 
                                                                                        if(@1.last_column < @2.first_column ){
                                                                                            for(let i = 0, size = @2.first_column - @1.last_column; i < size; i++ ){
                                                                                                $1.objeto = $1.objeto + ' ';
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        for(let i = 0, size = @2.first_line - @1.last_line; i < size; i++ ){
                                                                                            $1.objeto = $1.objeto + '\n';
                                                                                        }
                                                                                    }
                                                                                    $1.objeto = $1.objeto + $2.objeto;
                                                                                    $$ = { nodo: new Nodo('LISTA_CONT_ATRB_SMPL',[$1.nodo,$2.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>LISTA_CONT_ATRB_SMPL</td> <td>LISTA_CONT_ATRB_SMPL VALUES_CONT_ATRB_SMPL</td> </tr>');
                                                                               }
    | VALUES_CONT_ATRB_SMPL                                                    {
                                                                                    $$ = { nodo: new Nodo('LISTA_CONT_ATRB_SMPL',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>LISTA_CONT_ATRB_SMPL</td> <td>VALUES_CONT_ATRB_SMPL</td> </tr>');
                                                                               }
;

VALUES_CONT_ATRB_SMPL :
    VALUE                                                                      {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_ATRB_SMPL',[$1.nodo]), objeto: $1.objeto};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB_SMPL</td> <td>VALUE</td> </tr>');
                                                                               }
    | lt                                                                       {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_ATRB_SMPL',[new Nodo('lt',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB_SMPL</td> <td>lt</td> </tr>');
                                                                               }
    | qmrk                                                                     {
                                                                                    $$ = { nodo: new Nodo('VALUES_CONT_ATRB_SMPL',[new Nodo('qmrk',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUES_CONT_ATRB_SMPL</td> <td>qmrk</td> </tr>');
                                                                               }
;

VALUE:
    identifier                                                                 {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('identifier',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>identifier</td> </tr>');
                                                                               }
    | contentH                                                                 {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('contentH',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>contentH</td> </tr>');
                                                                               }
    | div                                                                      {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('div',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>div</td> </tr>');
                                                                               }
    | gt                                                                       {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('gt',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>gt</td> </tr>');
                                                                               }
    | asig                                                                     {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('asig',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>asig</td> </tr>');
                                                                               }
    | double                                                                   {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('double',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>double</td> </tr>');
                                                                               }
    | integer                                                                  {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('integer',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>integer</td> </tr>');
                                                                               }
    | qst                                                                      {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('qst',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>qst</td> </tr>');
                                                                               }
    | xml                                                                      {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('xml',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>xml</td> </tr>');
                                                                               }
    | minus                                                                    {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('minus',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>minus</td> </tr>');
                                                                               }
    | Escape                                                                   {
                                                                                    $$ = { nodo: new Nodo('VALUE',[new Nodo('Escape',[])]), objeto: $1};
                                                                                    reporteGramatical.push('<tr> <td>VALUE</td> <td>Escape</td> </tr>');
                                                                               }
;