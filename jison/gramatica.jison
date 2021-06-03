/*   LEXICAL GRAMMAR   */
%lex

%%



/*  OPERATOR ASSOCIATIONS AND PRECEDENCE  */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start S

%%

S : E EOF {}
