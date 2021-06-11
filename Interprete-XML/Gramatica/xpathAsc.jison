/* Definición Léxica */
%lex

%options case-insensitive

escapechar                          [\'\"\\bfnrtv]
escape                              \\{escapechar}
acceptedcharsdouble                 [^\"\\]+
stringdouble                        {escape}|{acceptedcharsdouble}
stringliteral                       \"{stringdouble}*\"

%%

\s+                                                     /* skip whitespace */

"last"                                                  return 'resLast'
"attr"                                                  return 'resAttr'
"node"                                                  return 'resNode'
"text"                                                  return 'resText'
"position"                                              return 'resPosition'
"child"                                                 return 'resChild'
"attribute"                                             return 'resAttribute'
"descendant"                                            return 'resDescendant'
"ancestor"                                              return 'resAncestor'
"ancestor-or-self"                                      return 'resAncestorSelf'
"div"                                                   return 'div'
"mod"                                                   return 'mod'
"or"                                                    return 'or'
"and"                                                   return 'and'
"+"                                                     return '+'
"-"                                                     return '-'
"*"                                                     return '*'
"="                                                     return '='
"!="                                                    return '!='
"<"                                                     return '<'
">"                                                     return '>'
"<="                                                    return '<='
">="                                                    return '>='
"/"                                                     return 'div'
"|"                                                     return '|'
"."                                                     return '.'
"@"                                                     return '@'
"["                                                     return '['
"]"                                                     return ']'
"("                                                     return '('
")"                                                     return ')'

/* Number literals */

(([0-9]+"."[0-9]*)|("."[0-9]+))                         return 'double';
[0-9]+                                                  return 'integer';
\"[^\"]*\"                                              return 'string';
([a-zA-Z])[a-zA-Z0-9_]*                                 return 'id';
{stringliteral}                                         return 'StringLiteral'

<<EOF>>                                                 return 'EOF'

//error lexico
.                                                       {
                                                            console.error('Error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                                        }

/lex

//SECCION DE IMPORTS
%{
        const { Error } = require('../Errores/Error')
        const { Element, Filter, Operation, TypeElement, TypeOperation } = require('../Instrucciones/Element/Element')

        var erroresSemanticos = [];
        var erroresLexicos = [];
%}

// DEFINIMOS PRESEDENCIA DE OPERADORES
%left 'or'
%left 'and'
%left '=' '!=' '<' '>' '<=' '>='
%left '+' '-'
%left '*' 'div' 'mod'

// DEFINIMOS PRODUCCIÓN INICIAL
%start START

%%

/* Definición de la gramática */
START : 
        PATHS EOF               {       
                                    $$ =    { 
                                                objeto: $1,
                                                erroresSemanticos: erroresSemanticos,
                                                erroresLexicos: erroresLexicos
                                            };

                                    erroresLexicos = [];
                                    erroresSemanticos = [];

                                    return $$; 
                                }
        ;

PATHS : 
        PATHS '|' PATH          { $$ = $1.push($3) }
        | PATH                  { $$ = [$1] }
        ;

PATH : 
        NODES                   { $$ = $1 }
        ;

NODES :
        NODES SLASH EL          { 
                                    if ($2 == 2) {
                                        $3.recursive = true
                                    }
                                    $1.push($3)
                                    $$ = $1
                                }
        | SLASH EL              {
                                    if ($1 == 2) {
                                        $2.recursive = true
                                        $2.fromRoot = true
                                    }
                                    else if ($1 == 1) {
                                        $2.fromRoot = true
                                    }
                                    $$ = [$2]
                                }
        ;

SLASH:
        div div                 { $$ = 2 }
        | div                   { $$ = 1 }
        |                       { $$ = 0 }
;

EL :
        id PRE                  { $$ = new Element($1, TypeElement.NODO, $2, @1.first_line, @1.first_column) }
        | '*'                   { $$ = new Element('', TypeElement.ALL, $2, @1.first_line, @1.first_column) }
        | ATTR                  { $$ = $1 }
        ;

ATTR :
        '@' ATTR_P              { $$ = $2 }
        ;

ATTR_P :
        id                      { $$ = new Element($1, TypeElement.NODO, $2, @1.first_line, @1.first_column) }
        | '*'                   { $$ = new Element($1, TypeElement.ALL, $2, @1.first_line, @1.first_column) }
        ;

PRE :
        '[' E ']'               { $$ = $2 }
        |                       { $$ = [] }
        ;

E : // return new Operacion()
        E '+' E                 { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.SUMA)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E '-' E               { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.RESTA)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E '*' E               { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.MULTIPLICACION)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E 'div' E             { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.DIVISION)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E '=' E               { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.IGUAL)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E '!=' E              { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.DIFERENTE)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E '<' E               { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.MENOR)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E '>' E               { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.MAYOR)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E '<=' E              { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.MENOR_IGUAL)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E '>=' E              { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.MAYOR_IGUAL)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E 'or' E              { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.OR)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E 'and' E             { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.AND)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | E 'mod' E             { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.MOD)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                }
        | '(' E ')'             { $$ = $2 }
        | double                { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.DOUBLE)
                                    op.savePrimitiveOp($1)
                                    $$ = op
                                }
        | integer               { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.INTEGER)
                                    op.savePrimitiveOp($1)
                                    $$ = op
                                }
        | StringLiteral         { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.STRING)
                                    op.savePrimitiveOp($1)
                                    $$ = op
                                }
        | id                    { 
                                    var op = new Operation($1.first_line, @1.first_column, TypeOperation.ID)
                                    op.savePrimitiveOp($1)
                                    $$ = op
                                }
        | last '(' ')'          { $$ = new Operation('LAST'.first_line, @1.first_column, TypeOperation.LAST) }
        | position '(' ')'      { $$ = new Operation('POSITION'.first_line, @1.first_column, TypeOperation.POSITION) }
        | text '(' ')'          { $$ = new Operation('TEXT'.first_line, @1.first_column, TypeOperation.TEXT) }
        | ATTR                  { $$ = new Operation($1.name, $1.linea, $1.columna, TypeOperation.ATRIBUTO) }
        ;
