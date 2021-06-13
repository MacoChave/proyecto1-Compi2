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
"div"                                                   return 'opDiv'
"mod"                                                   return 'opMod'
"or"                                                    return 'oPor'
"and"                                                   return 'opAnd'
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
                                                            var lexerAscError = new Error(
                                                                yytext, 
                                                                yylloc.first_line, 
                                                                yylloc.first_column, 
                                                                'Error léxico'
                                                            );
                                                            xPathAscSyntaxErrors.push(lexerAscError)
                                                        }

/lex

//SECCION DE IMPORTS
%{
        const { Error } = require('../Errores/Error')
        const { Element, Filter, Operation, TypeElement, TypeOperation } = require('../Instrucciones/Element/Element')

        var xPathAscSyntaxErrors = []
        var xPathAscLexerErrors = []
        var xPathAscAST_nodes
        var xPathAscAST_path
%}

// DEFINIMOS PRESEDENCIA DE OPERADORES
%left 'opOr'
%left 'opAnd'
%left '=' '!=' '<' '>' '<=' '>='
%left '+' '-'
%left '*' 'opDiv' 'opMod'

// DEFINIMOS PRODUCCIÓN INICIAL
%start START

%%

/* Definición de la gramática */
START : 
        PATHS EOF               {
                                    $$ =    { 
                                                XPath: $1,
                                                SyntaxErrors: xPathAscSyntaxErrors,
                                                LexerErrors: xPathAscLexerErrors
                                            };

                                    var nodo = {
                                        name: 'START',
                                        val: 'START',
                                        children: [xPathAscAST_path]
                                    }
                                    $$ = {...$$, Nodo: nodo}

                                    xPathAscLexerErrors = [];
                                    xPathAscSyntaxErrors = [];

                                    return $$; 
                                }
        ;

PATHS : 
        PATHS '|' PATH          { 
                                    $1.push($3) 
                                    $$ = $1
                                    var nodo = {
                                        name: 'PATHS', 
                                        val: 'PATHS', 
                                        children: [
                                            xPathAscAST_path,
                                            {name: '|', val: '|', children: []},
                                            xPathAscAST_nodes
                                        ]
                                    }
                                    xPathAscAST_path = nodo
                                }
        | PATH                  { 
                                    $$ = [$1]
                                    var nodo = {name: 'PATHS', val: 'PATHS', children: [xPathAscAST_nodes]}
                                    xPathAscAST_path = nodo
                                }
        ;

PATH : 
        NODES                   { 
                                    var nodo = {name: 'PATH', val: 'PATH', children: [xPathAscAST_path]}
                                    $$ = $1 
                                    $$ = {...$$, Nodo: nodo}
                                    xPathAscAST_path = nodo
                                }
        ;

NODES :
        NODES div EL            { 
                                    if ($2 == 2) {
                                        $3.recursive = true
                                    }
                                    $1.push($3)
                                    $$ = $1
                                    var nodo = {
                                        name: 'NODES',
                                        val: 'NODES',
                                        children: [
                                            xPathAscAST_nodes,
                                            {name: 'div', val: '/', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    xPathAscAST_nodes = nodo
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
                                    var nodo = {
                                        name: 'NODES',
                                        val: 'NODES',
                                        children: [
                                            $1.Nodo,
                                            $2.Nodo
                                        ]
                                    }
                                    xPathAscAST_nodes = nodo
                                }
        ;

SLASH:
        div div                 { 
                                    $$ = 2 
                                    var nodo = {
                                        name: 'SLASH',
                                        val: 'SLASH',
                                        children: [
                                            {name: 'div', val: '/', children: []},
                                            {name: 'div', val: '/', children: []},
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | div                   { 
                                    $$ = 1 
                                    var nodo = {
                                        name: 'SLASH',
                                        val: 'SLASH',
                                        children: [{name: 'div', val: '/', children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        |                       { 
                                    $$ = 0 
                                    var nodo = {
                                        name: 'SLASH',
                                        val: 'SLASH',
                                        children: []
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
;

EL :
        id PRE                  { 
                                    $$ = new Element($1, TypeElement.NODO, $2, 1, @1.first_column) 
                                    var nodo = {
                                        name: 'EL',
                                        val: 'EL',
                                        children: [
                                            {name: 'id', val: $1, children: []},
                                            $2.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | '*'                   { 
                                    $$ = new Element('', TypeElement.ALL, [], 1, @1.first_column) 
                                    var nodo = {
                                        name: 'EL',
                                        val: 'EL',
                                        children: [{name: '*', val: '*', children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | ATTR                  { 
                                    $$ = $1 
                                    var nodo = {
                                        name: 'EL',
                                        val: 'EL',
                                        children: [$1.Nodo]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | error                 { 
                                    var xPathSyntaxAscError = new Error(
                                        yytext,
                                        this._$.first_line,
                                        this._$.first_column,
                                        'Error sintáctico'    
                                    )
                                    xPathAscSyntaxErrors.push(xPathSyntaxAscError) 
                                }
        ;

ATTR :
        '@' ATTR_P              { 
                                    $$ = $2 
                                    var nodo = {
                                        name: 'ATTR',
                                        val: 'ATTR',
                                        children: [
                                            {name: '@', val: '@', children: []},
                                            $2.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        ;

ATTR_P :
        id                      { 
                                    $$ = new Element($1, TypeElement.NODO, [], 1, @1.first_column)
                                    var nodo = {
                                        name: 'ATTR_P',
                                        val: 'ATTR_P',
                                        children: [{name: 'id', val: $1, children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | '*'                   { 
                                    $$ = new Element($1, TypeElement.ALL, [], 1, @1.first_column)
                                    var nodo = {
                                        name: 'ATTR_P',
                                        val: 'ATTR_P',
                                        children: [{name: '*', val: '*', children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        ;

PRE :
        '[' E ']'               { 
                                    $$ = $2 
                                    var nodo = {
                                        name: 'PRE',
                                        val: 'PRE',
                                        children: [
                                            {name: '{', val: '{', children: []},
                                            $2.Nodo,
                                            {name: '}', val: '}', children: []},
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        |                       { 
                                    $$ = []
                                    var nodo = {
                                        name: 'PRE',
                                        val: 'PRE',
                                        children: []
                                    }
                                    $$ = {...$$, Nodo: nodo} 
                                }
        ;

E : // return new Operacion()
        E '+' E                 { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.SUMA)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '+', val: '+', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E '-' E               { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.RESTA)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '-', val: '-', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E '*' E               { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.MULTIPLICACION)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '*', val: '*', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E 'opDiv' E           { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.DIVISION)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: 'div', val: 'div', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E '=' E               { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.IGUAL)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '=', val: '=', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E '!=' E              { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.DIFERENTE)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '!=', val: '!=', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E '<' E               { 
                                    console.log({E1: $1, op: $2, E2: $3})
                                    var op = new Operation(1, @1.first_column, TypeOperation.MENOR)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '<', val: '<', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E '>' E               { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.MAYOR)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '>', val: '>', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E '<=' E              { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.MENOR_IGUAL)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '<=', val: '<=', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E '>=' E              { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.MAYOR_IGUAL)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: '>=', val: '>=', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E 'opOr' E            { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.OR)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: 'or', val: 'or', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E 'opAnd' E           { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.AND)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: 'and', val: 'and', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | E 'opMod' E           { 
                                    
                                    var op = new Operation(1, @1.first_column, TypeOperation.MOD)
                                    op.saveBinaryOp($1, $3)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            $1.Nodo,
                                            {name: 'mod', val: 'mod', children: []},
                                            $3.Nodo
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | '(' E ')'             { 
                                    $$ = $2 
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [
                                            {name: '(', val: '(', children: []},
                                            $2.Nodo,
                                            {name: ')', val: ')', children: []},
                                        ]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | double                { 
                                    var op = new Operation(1, @1.first_column, TypeOperation.DOUBLE)
                                    op.savePrimitiveOp($1)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [{name: 'double', val: $1, children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | integer               { 
                                    var op = new Operation(1, @1.first_column, TypeOperation.INTEGER)
                                    op.savePrimitiveOp($1)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [{name: 'integer', val: $1, children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | StringLiteral         { 
                                    var op = new Operation(1, @1.first_column, TypeOperation.STRING)
                                    op.savePrimitiveOp($1)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [{name: 'string', val: $1, children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | id                    { 
                                    var op = new Operation(1, @1.first_column, TypeOperation.ID)
                                    op.savePrimitiveOp($1)
                                    $$ = op
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [{name: 'id', val: 'id', children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | resLast '(' ')'       { 
                                    $$ = new Operation('LAST'.first_line, @1.first_column, TypeOperation.LAST) 
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [{name: 'last()', val: 'last()', children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | resPosition '(' ')'   { 
                                    $$ = new Operation('POSITION'.first_line, @1.first_column, TypeOperation.POSITION) 
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [{name: 'position()', val: 'position()', children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | resText '(' ')'       { 
                                    $$ = new Operation('TEXT'.first_line, @1.first_column, TypeOperation.TEXT) 
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [{name: 'text()', val: 'text()', children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | resNode '(' ')'       { 
                                    $$ = new Operation('NODE'.first_line, @1.first_column, TypeOperation.NODE) 
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [{name: 'node()', val: 'node()', children: []}]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        | ATTR                  { 
                                    $$ = new Operation($1.name, $1.linea, $1.columna, TypeOperation.ATRIBUTO) 
                                    var nodo = {
                                        name: 'E',
                                        val: 'E',
                                        children: [$1.Nodo]
                                    }
                                    $$ = {...$$, Nodo: nodo}
                                }
        ;
