analizeCode.addEventListener('click', () => {
	// ANALIZAR XML
	console.log(codeBlock.textContent);
});

sendXPath.addEventListener('click', () => {
	// ANALIZAR XPATH
	console.log(codeXPath.value);
});

compileCode.addEventListener('click', () => {
	// COMPILAR XPATH
	console.log('compileCode was clicked');
});
