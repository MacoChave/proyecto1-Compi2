import { AST } from './AST/AST';
import { Entorno } from './AST/Entorno';
import { Instruccion } from './Interfaces/Instruccion';
import { Etiqueta } from './Expresiones/Objeto';
import { Comilla } from './Expresiones/Atributo';
import { TypeElement } from './Instrucciones/Element/Element';

const xmlAsc = require('./Gramatica/gramatica_XML_ASC');
const xpathAsc = require('./Gramatica/xpathAsc');

export class Main {
	lexicos: any = [];
	lista_objetos: any = [];
	lista_objetos_xpath: any = [];
	nodos: any = [];
	edges: any = [];
	nodoxpath: any = [];
	edgesxpath: any = [];
	tablaSimbolos: any = '';

	i: number = 1;

	ejecutarCodigoXmlAsc(entrada: any) {
		console.log('ejecutando xmlAsc ...');

		window.localStorage.setItem('reporteGramatical', '');

		const objetos = xmlAsc.parse(entrada);
		console.log('**********');
		console.log(objetos);
		console.log('**********');
		this.lista_objetos = objetos.objeto;
		console.log(objetos);

		if (this.lista_objetos.length > 1) {
			console.log(this.getXmlFormat(this.lista_objetos[1]));
		} else {
			console.log(this.getXmlFormat(this.lista_objetos[0]));
		}

		window.localStorage.setItem(
			'lexicos',
			JSON.stringify(objetos.erroresLexicos)
		);

		if (objetos !== undefined) {
			let reporteGramatical = '';
			for (let i = objetos.reporteGramatical.length - 1; i >= 0; i--) {
				reporteGramatical += objetos.reporteGramatical[i];
			}
			window.localStorage.setItem('reporteGramatical', reporteGramatical);
		}
	}

	ejecutarCodigoXpathAsc(entrada: any) {
		console.log('ejecutando xpathAsc ...');
		const objetos = xpathAsc.parse(entrada);
		console.log(objetos);
		this.lista_objetos_xpath = objetos.Nodo;

		// this.execPath_list(objetos.XPath);
	}

	getXmlFormat(objeto: any) {
		let contenido = '';
		let atributos = '';
		let etiqueta = '';

		for (let i = 0, size = objeto.listaAtributos.length; i < size; i++) {
			if (Comilla.SIMPLE === objeto.listaAtributos[i].comilla) {
				atributos +=
					objeto.listaAtributos[i].identificador +
					"='" +
					objeto.listaAtributos[i].textWithoutSpecial +
					"'";
			} else {
				atributos +=
					objeto.listaAtributos[i].identificador +
					'="' +
					objeto.listaAtributos[i].textWithoutSpecial +
					'"';
			}
			if (i !== size - 1) {
				atributos += ' ';
			}
		}

		etiqueta += '\n<' + objeto.identificador;
		if (atributos !== '') {
			etiqueta += ' ' + atributos + ' ';
		}
		if (objeto.etiqueta === Etiqueta.DOBLE) {
			etiqueta += '>';
			if (objeto.listaObjetos.length > 0) {
				for (
					let i = 0, size = objeto.listaObjetos.length;
					i < size;
					i++
				) {
					let children = this.getXmlFormat(objeto.listaObjetos[i]);
					contenido += children;
				}
			} else {
				contenido += objeto.textWithoutSpecial;
			}

			if (objeto.listaObjetos.length > 0) {
				etiqueta += '\t\t' + contenido;
				etiqueta += '\n';
			} else {
				etiqueta += contenido;
			}
			etiqueta += '</' + objeto.identificador + '>';
		} else if (objeto.etiqueta === Etiqueta.UNICA) {
			etiqueta += '/>';
		}
		return etiqueta;
	}

	readFile(e: any) {
		console.log('read file ...');
		var file = e.target.files[0];
		if (!file) return;
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			let target = e.target;
			if (target !== undefined && target !== null) {
				console.log('load text ...');
				var contents = target.result;
				var element = document.getElementById('codeBlock');
				if (element !== undefined && element !== null) {
					element.value = contents;
				} else {
					console.log('Error set content');
				}
			} else {
				console.log('Error read file');
			}
		};
		reader.readAsText(file);
	}

	prueba() {
		console.log('hola mundo');
	}

	getErroresLexicos() {
		let lex = window.localStorage.getItem('lexicos');
		if (lex) {
			this.lexicos = JSON.parse(lex);
			console.log(this.lexicos);

			var tbodyRef: any = document.getElementById('keywords');
			let i = 1;
			this.lexicos.forEach((element: any) => {
				let newRow = tbodyRef.insertRow();
				let newCell = newRow.insertCell();
				let newText2 = document.createTextNode(element.descripcion);
				newCell.appendChild(newText2);
			});
		}
		//setup our table array
	}

	TablaSimbolos() {
		window.localStorage.setItem('TablaSimbolosXML', '');
		this.lista_objetos.forEach((element: any) => {
			// console.log(element.identificador);
			let aux =
				'<tr><td>' +
				element.identificador +
				'</td><td>Objeto</td><td>Global</td>' +
				'<td>' +
				element.linea +
				'</td><td>' +
				element.columna +
				'</td></tr>';

			this.tablaSimbolos = this.tablaSimbolos + aux;

			this.getObjetosTablaxml(
				element.listaObjetos,
				element.identificador
			);
			if (element.listaAtributos) {
				this.getAtributos(
					element.listaAtributos,
					element.identificador
				);
			}
		});

		window.localStorage.setItem('TablaSimbolosXML', this.tablaSimbolos);
	}

	getObjetosTablaxml(listaObjeto: any, ambito: string) {
		listaObjeto.forEach((element: any) => {
			let aux =
				'<tr><td>' +
				element.identificador +
				'</td><td>Objeto</td><td>' +
				ambito +
				'</td>' +
				'<td>' +
				element.linea +
				'</td><td>' +
				element.columna +
				'</td></tr>';

			this.tablaSimbolos = this.tablaSimbolos + aux;

			this.getObjetosTablaxml(
				element.listaObjetos,
				element.identificador
			);
			if (element.listaAtributos) {
				this.getAtributosTablaxml(
					element.listaAtributos,
					element.identificador
				);
			}
		});
	}

	getAtributosTablaxml(listaObjeto: any, ambito: string) {
		listaObjeto.forEach((element: any) => {
			let aux =
				'<tr><td>' +
				element.identificador +
				'</td><td>Atributo</td><td>' +
				ambito +
				'</td>' +
				'<td>' +
				element.linea +
				'</td><td>' +
				element.columna +
				'</td></tr>';

			this.tablaSimbolos = this.tablaSimbolos + aux;

			if (element.textWithoutSpecial != '') {
				aux =
					'<tr><td>' +
					element.textWithoutSpecial +
					'</td><td>Atributo</td><td>' +
					element.identificador +
					'</td>' +
					'<td>' +
					element.linea +
					'</td><td>' +
					element.columna +
					'</td></tr>';

				this.tablaSimbolos = this.tablaSimbolos + aux;
			}
		});
	}

	graficar() {
		this.nodos = [];
		this.edges = [];

		let aux = {
			id: 1,
			label: 's',
		};
		this.nodos.push(aux);

		this.lista_objetos.forEach((element: any) => {
			// console.log(element.identificador);

			this.i++;
			let padre = this.i;
			let aux = {
				id: padre,
				label: element.identificador,
			};
			this.nodos.push(aux);
			let aux2 = {
				from: 1,
				to: this.i,
			};

			this.edges.push(aux2);
			this.getObjetos(element.listaObjetos, padre);
			if (element.listaAtributos) {
				this.getAtributos(element.listaAtributos, padre);
			}
		});

		window.localStorage.setItem('nodos', JSON.stringify(this.nodos));
		window.localStorage.setItem('edges', JSON.stringify(this.edges));

		//console.log(this.nodos);
		//console.log(this.edges);
	}

	getAtributos(listaObjeto: any, padre: number) {
		listaObjeto.forEach((element: any) => {
			this.i++;
			let hijo = this.i;
			let aux = {
				id: hijo,
				label: element.identificador,
			};
			let aux2 = {
				from: padre,
				to: hijo,
			};
			this.nodos.push(aux);
			this.edges.push(aux2);

			if (element.textWithoutSpecial != '') {
				this.i++;
				aux = {
					id: this.i,
					label: element.textWithoutSpecial,
				};
				aux2 = {
					from: hijo,
					to: this.i,
				};

				this.nodos.push(aux);
				this.edges.push(aux2);
			}
		});
	}

	getObjetos(listaObjeto: any, padre: number) {
		listaObjeto.forEach((element: any) => {
			this.i++;
			let hijo = this.i;
			let aux = {
				id: this.i,
				label: element.identificador,
			};
			let aux2 = {
				from: padre,
				to: this.i,
			};

			this.nodos.push(aux);
			this.edges.push(aux2);

			if (element.textWithoutSpecial != '') {
				this.i++;
				aux = {
					id: this.i,
					label: element.textWithoutSpecial,
				};
				aux2 = {
					from: hijo,
					to: this.i,
				};
				this.nodos.push(aux);
				this.edges.push(aux2);
			}

			this.getObjetos(element.listaObjetos, this.i);
			if (element.listaAtributos) {
				this.getAtributos(element.listaAtributos, hijo);
			}
		});
	}

	arbolXpath() {
		this.i = 1;
		this.nodoxpath = [];
		this.edgesxpath = [];

		let aux = {
			id: 1,
			label: 's',
		};
		this.nodoxpath.push(aux);

		let element = this.lista_objetos_xpath;
		console.log(element);
		console.log(element.val);

		this.i++;
		let padre = this.i;
		aux = {
			id: padre,
			label: element.val,
		};
		this.nodoxpath.push(aux);
		let aux2 = {
			from: 1,
			to: this.i,
		};

		this.edgesxpath.push(aux2);
		this.getObjetosXpath(element.children, padre);

		window.localStorage.setItem(
			'nodosxpath',
			JSON.stringify(this.nodoxpath)
		);
		window.localStorage.setItem(
			'edgesxpath',
			JSON.stringify(this.edgesxpath)
		);

		console.log(this.nodoxpath);
		console.log(this.edgesxpath);
	}

	getObjetosXpath(listaObjeto: any, padre: number) {
		listaObjeto.forEach((element: any) => {
			if (element != undefined) {
				this.i++;
				let hijo = this.i;
				let aux = {
					id: this.i,
					label: element.val,
				};
				let aux2 = {
					from: padre,
					to: this.i,
				};

				this.nodoxpath.push(aux);
				this.edgesxpath.push(aux2);

				this.getObjetosXpath(element.children, this.i);
			}
		});
	}

	execPath_list(pathList: any) {
		/** //root/message | //root/price | /@abc */
		pathList.forEach((path: any) => {
			console.log('<---------->');
			console.log(`${path.length} NODOS`);
			this.execNodes_list(path);
			console.log('<---------->');
		});
	}

	execNodes_list(nodeList: any) {
		let xmlObj = this.lista_objetos[0];
		console.log('***********');
		nodeList.forEach((node: any) => {
			xmlObj = this.searchElement(xmlObj, node.name, node.type);
			console.log(xmlObj);
		});
		console.log('***********');
	}

	searchElement(xmlObj: any, nodename: string, type: TypeElement): any {}

	execExp_list() {}

	execAttr_list() {}

	setListener() {
		let inputFile = document.getElementById('open-file');
		if (inputFile !== undefined && inputFile !== null) {
			inputFile.addEventListener('change', this.readFile, false);
			console.log('inputFile activo');
		}

		let analizeXmlAsc = document.getElementById('analizeXmlAsc');
		if (analizeXmlAsc !== undefined && analizeXmlAsc !== null) {
			console.log('btn xmlAsc activo');
			analizeXmlAsc.addEventListener('click', () => {
				// ANALIZAR XML
				let codeBlock: any = document.getElementById('codeBlock');
				let content =
					codeBlock !== undefined && codeBlock !== null
						? codeBlock.value
						: '';
				this.ejecutarCodigoXmlAsc(content);
				this.graficar();
			});
		}

		let analizeXPathAsc = document.getElementById('analizeXPathAsc');
		if (analizeXPathAsc !== undefined && analizeXPathAsc !== null) {
			console.log('btn xpathAsc activo');
			analizeXPathAsc.addEventListener('click', () => {
				// ANALIZAR XML
				let input: any = document.getElementById('codeXPath');
				let content =
					input !== undefined && input !== null ? input.value : '';
				this.ejecutarCodigoXpathAsc(content);
				this.arbolXpath();
			});
		}

		let clean = document.getElementById('clean');
		if (clean !== undefined && clean !== null) {
			console.log('btn clean activo');
			clean.addEventListener('click', () => {
				let codeBlock: any = document.getElementById('codeBlock');
				if (codeBlock !== undefined && codeBlock !== null) {
					codeBlock.value = '';
				}
			});
		}

		let tablaErrores = document.getElementById('tablaErrores');
		if (tablaErrores !== undefined && tablaErrores !== null) {
			console.log('btn Tabla Errores Activo');
			tablaErrores.addEventListener('click', () => {
				this.getErroresLexicos();
			});
		}

		let tablaSimbolosxml = document.getElementById('tablaxml');
		if (tablaSimbolosxml !== undefined && tablaSimbolosxml !== null) {
			console.log('btn Tabla Simbolos Activo');
			tablaSimbolosxml.addEventListener('click', () => {
				this.TablaSimbolos();
			});
		}
	}
}
