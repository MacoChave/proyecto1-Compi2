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
        NODES SLASH EL
        | SLASH EL
        ;

SLASH:
        div div
        | div
        |
;

EL :
        id PRE
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
        | id
        | last '(' ')'
        | position '(' ')'
        | ATTR
        ;
