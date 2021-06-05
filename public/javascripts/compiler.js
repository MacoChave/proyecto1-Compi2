"use strict";
const xmlGrammarAsc = requiere('./xml/Grammar/xmlGrammarAsc');
analizeXML.addEventListener('click', () => {
    // ANALIZAR XML
    console.log(codeBlock.textContent);
});
analizeXPath.addEventListener('click', () => {
    // ANALIZAR XPATH
    let input = codeXPath.value;
    const elements = xmlGrammarAsc.parse(input);
    console.log(elements);
});
compileXML.addEventListener('click', () => {
    // COMPILAR XPATH
    console.log('compile xml was clicked');
});
compileXPATH.addEventListener('click', () => {
    // COMPILAR XPATH
    console.log('compile xpath was clicked');
});
