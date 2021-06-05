/* Definición Léxica */
%lex

%options case-insensitive

escStr      [\'\"]
strText     [^<^>]
strAttr     {escStr} [A-Za-z -_]+ {escStr}
id          [A-Za-z0-9-_]+
comment     "<!--" [^*]+ "-->"
whitespaces \s+

%%

comment     /* SKIP COMMENT */
whitespaces /* SKIP WHITESPACES */

"xml"       return 'xml'
"version"   return 'version'
"encoding"  return 'encoding'

"<"         return 'oPar'
">"         return 'cPar'
"/"         return 'fSlash'
"="         return 'equal'
"<?"         return 'oHead'
"?>"         return 'cHead'

{strText}   return 'stringTxt'
{strAttr}   return 'stringAtt'
{id}        return 'id'

/* LEXICAL ERROR */
.           { console.error(`Lexer error ${yytext} in line ${yylloc.first_line} and column ${yylloc.first_column}`) }

<<EOF>>     return 'EOF'

/lex

//SECCION DE IMPORTS
%{
    const { Element } = requiere('../Expressions/Element')
    const { Attribute } = requiere('../Expressions/Attribute')
%}

/* ASSOCIATIVITY & PRECEDENCES */
%left 'oPar' 'cPar'

/* START PRODUCTIONS */
%start START

%%

/* GRAMMAR */
START : HEADER OBJECTS EOF  { 
                                $$ = $2
                                return $$
                            }
;

HEADER : oHead xml ATTRS cHead
        | /* EMPTY */
;

OBJECTS : OBJECTS OBJECT    {  
                                $1.push($2)
                                $$ = $1    
                            }
        | OBJECT { $$ = [$1] }
;

OBJECT : oPar id ATTRS cpar OBJECTS oPar fSlash id cpar { $$ = new Element($2, $3, '', $5, @1.first_line, @1.first_column) }
        | oPar id ATTRS cpar strText oPar fSlash id cpar { $$ = new Element($2, $3, $5, [], @1.first_line, @1.first_column) }
        | oPar id ATTRS cpar fSlash cpar { $$ = new Element($2, $3, '', [], @1.first_line, @1.first_column) }
        | error { console.error(`Syntax error: ${yytext} in line ${this._$.first_line} and column ${this._$.first_column}`) }
;

ATTR_ : ATTRS { $$ = $1 }
        | /* EMPTY */ { $$ = [] }
;

ATTRS : ATTRS ATTR  {    $1.push($2)
                        $$ = $1 
                    }
        | ATTR { $$ = [$1] }
;

ATTR : id equal strAttr { $$ = new Attribute($1, $3, @1.first_line, @1.first_column) }
;