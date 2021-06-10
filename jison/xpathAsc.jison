/* Definición Léxica */
%lex

%options case-insensitive

%%

\s+                                                     /* skip whitespace */

"last"                                                  return 'resLast'
"attr"                                                  return 'resAttr'
"node"                                                  return 'resNode'
"text"                                                  return 'resText'
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
"/"                                                     return '/'
"|"                                                     return '|'
"."                                                     return '.'
"@"                                                     return '@'
"["                                                     return '['
"]"                                                     return ']'
"("                                                     return '('
")"                                                     return ')'

/* Number literals */

[0-9]+("."[0-9]+)?\b                                    return 'number'
\"[^\"]*\"                                              return 'string';
([a-zA-Z])[a-zA-Z0-9_]*                                 return 'id';

<<EOF>>                                                 return 'EOF'

//error lexico
.                                                       {
                                                            console.error('Error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                                        }

/lex

//SECCION DE IMPORTS
%{
    const { Print } = require("../Instrucciones/Primitivas/Print");
    const { Primitivo } = require("../Expresiones/Primitivo");
    const { Operacion, Operador } = require("../Expresiones/Operacion");
    const { Objeto, Etiqueta } = require("../Expresiones/Objeto");
    const { Atributo } = require("../Expresiones/Atributo");
%}

/* operator associations and precedence */

// DEFINIMOS PRODUCCIÓN INICIAL
%start START

%%

/* Definición de la gramática */
START : 
        PATHS EOF
        ;

PATHS : 
        PATHS '|' PATH
        | PATH
        ;

PATH : 
        NODES
        ;

NODES :
        NODES '/' ND
        | ND
        ;

ND : 
        '/' MOD_EL
        | MOD_EL
        ;

MOD_EL :
        '/' EL
        | EL
        ;

EL :
        id
        | '*'
        | ATTR
        ;

ATTR :
        '@' ATTR_P
        ;

ATTR_P :
        id
        | '*'
        ;

PRE :
        '[' E ']'
        |
        ;

E :
        E '+' E
        | E '-' E
        | E '*' E
        | E 'div' E
        | E '=' E
        | E '!=' E
        | E '<' E
        | E '>' E
        | E '<=' E
        | E '>=' E
        | E 'or' E
        | E 'and' E
        | E 'mod' E
        | '(' E ')'
        | double
        | integer
        | StringLiteral
        | identifier
        | last '(' ')'
        | position '(' ')'
        | ATTR
        ;
