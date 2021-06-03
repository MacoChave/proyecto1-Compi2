function readFile(e) {
	var file = e.target.files[0];
	if (!file) return;

	var reader = new FileReader();
	reader.onload = (e) => {
		var contents = e.target.result;
		displayContents(contents);
	};
	reader.readAsText(file);
}

function displayContents(contents) {
	codeBlock.textContent = contents;
}

openFile?.addEventListener('change', readFile, false);
