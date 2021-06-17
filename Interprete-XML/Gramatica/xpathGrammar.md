# Gramática XPATH Ascendente

```
<start> ::= <paths> EOF
<paths> ::= <paths> '|' <path>
          | <path>
          ;

<path> ::= <nodes>
         ;

<nodes> ::= <nodes> <slash> <el>+
         | <slash> <el>
         ;

<slash> ::= '/' '/'
          | '/'
          | <empty>
          ;

<el> ::= id
        | id <pre>
        | resParent '::' id
        | resChild '::' id
        | resSelf '::' id
        | resPrec '::' id
        | resPrecSibling '::' id
        | resAttribute '::' id
        | resDesc '::' id
        | resDescSelf '::' id
        | resAnc '::' id
        | resAncSelf '::' id
        | resFollow '::' id
        | resFollowSibling '::' id
        | '*'
        | '..'
        | '.'
        | <attr>
        | error
        ;

<attr> ::= '@' <attr_p>
         ;

<attr_p> ::= id
           | '*'
           ;

<pre> ::= '[' <e> ']'
        ;

<e> ::= <e> '+' <e>
      | <e> '-' <e>
      | <e> '*' <e>
      | <e> 'opDiv' <e>
      | <e> '=' <e>
      | <e> '!=' <e>
      | <e> '<' <e>
      | <e> '>' <e>
      | <e> '<=' <e>
      | <e> '>=' <e>
      | <e> 'opOr' <e>
      | <e> 'opAnd' <e>
      | <e> 'opMod' <e>
      | '(' <e> ')'
      | double
      | integer
      | StringLiteral
      | id
      | resLast '(' ')'
      | resPosition '(' ')'
      | resText '(' ')'
      | resNode '(' ')'
      | <attr>
      ;
```