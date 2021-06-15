import { Etiqueta, Objeto } from './Expresiones/Objeto';
import { Comilla } from './Expresiones/Atributo';
import { Element, TypeElement } from './Instrucciones/Element/Element';

const xmlAsc = require('./Gramatica/gramatica_XML_ASC');
const xpathAsc = require('./Gramatica/xpathAsc');

export class Main {
	lexicos: any = [];
	lista_objetos: any = [];
	lista_objetos_xpath: any = [];
	listacst: any = [];

	nodos: any = [];
	edges: any = [];
	nodoscst: any = [];
	edgescst: any = [];

	nodoxpath: any = [];
	edgesxpath: any = [];
	tablaSimbolos: any = '';

	i: number = 1;
	j: number = 1;

	ejecutarCodigoXmlAsc(entrada: any) {
		console.log('ejecutando xmlAsc ...');

		window.localStorage.setItem('reporteGramatical', '');

		const objetos = xmlAsc.parse(entrada);
		// console.log('**********');
		console.log(objetos);
		// console.log('**********');
		this.lista_objetos = objetos.objeto;
		this.listacst = objetos.nodos;
		console.log(this.listacst);

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
		console.value = '';
		const objetos = xpathAsc.parse(entrada);
		console.log(objetos);
		this.lista_objetos_xpath = objetos.Nodo;

		this.execPath_list(objetos.XPath);
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
				var element: any = document.getElementById('codeBlock');
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
				this.getAtributosTablaxml(
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

	graficarcst(nodos: any, padre: number) {
		console.log('entra?');
		this.getnodoscst(nodos, padre);
		window.localStorage.setItem('nodoscst', JSON.stringify(this.nodoscst));
		window.localStorage.setItem('edgescst', JSON.stringify(this.edgescst));
	}

	getnodoscst(nodos: any, papa: number) {
		let aux = nodos;
		let auxnodos = {
			id: papa,
			label: aux.nombre,
		};
		this.nodoscst.push(auxnodos);
		let nodohijo = aux.hijos;
		if (nodohijo && nodohijo.length > 0) {
			nodohijo.forEach((element: any) => {
				this.j++;
				let hijo = this.j;

				let auxedges = {
					from: papa,
					to: hijo,
				};
				this.edgescst.push(auxedges);
				this.getnodoscst(element, hijo);
			});
		}
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
			console.log(`PATH LIST: ${path.length}`);
			this.execNodes_list(path);
		});
	}

	execNodes_list(nodeList: Element[]) {
		let rootXML = {
			elements:
				this.lista_objetos.length > 1
					? this.lista_objetos[1]
					: this.lista_objetos[0],
			parent: undefined,
		};

		nodeList.forEach((node: any) => {
			if (typeof node === 'string') return;
		});
		switch (this.checkRoot(rootXML, nodeList)) {
			case 1: {
				/* ENCONTRADO */
				let index = 1;
				if (nodeList.length === index) {
					/* MOSTRAR XML EN CONSOLA */
					console.info(rootXML);
				} else {
					if (nodeList[index].type === TypeElement.ATRIBUTO) {
						rootXML = {
							elements: rootXML.elements.listaAtributos,
							parent: rootXML.elements,
						};
						console.log('A buscar atributos!!');
						this.searchElement(rootXML, nodeList, index);
					} else if (nodeList[index].type === TypeElement.NODO) {
						rootXML = {
							elements: rootXML.elements.listaObjetos,
							parent: rootXML.elements,
						};
						console.log('A buscar elementos!!');
						this.searchElement(rootXML, nodeList, index);
					}
				}
				break;
			}
			case 2: {
				/* PROFUNDIDAD */
				let index = 0;
				rootXML = {
					elements: this.lista_objetos.listaObjetos,
					parent: undefined,
				};
				console.log('A seguir buscando');
				this.searchElement(rootXML, nodeList, index);
				break;
			}
			case 3: {
				/* ENCONTRADO */
				let index = 2;
				if (nodeList.length === index) {
					/* MOSTRAR XML EN CONSOLA */
					console.info(rootXML);
				} else {
					if (nodeList[index].type === TypeElement.ATRIBUTO) {
						rootXML = {
							elements: this.lista_objetos.listaAtributos,
							parent: rootXML.elements,
						};
						this.searchElement(rootXML, nodeList, index);
					} else if (nodeList[index].type === TypeElement.ATRIBUTO) {
						rootXML = {
							elements: this.lista_objetos.listaObjetos,
							parent: rootXML.elements,
						};
						this.searchElement(rootXML, nodeList, index);
					}
				}
				break;
			}
			default:
				console.warn('No coincide con nodo raiz');
		}
	}

	checkRoot(rootXML: any, nodeList: Element[]): any {
		let root: Objeto = rootXML.elements;
		if (nodeList[0].type === TypeElement.NODO) {
			if (nodeList[0].slashes === 0 || nodeList[0].slashes === 1) {
				// NODOS++ & BUSCAR EN ELEMENTOS | ATRIBUTOS DE ROOT
				if (nodeList[0].name === root.identificador) return 1;
			} else if (nodeList[0].slashes === 2) {
				// NODO++ & BUSCAR EN ELEMENTOS | ATRIBUTOS HIJOS DE ROOT
				if (nodeList[0].name === root.identificador) return 1;

				// NODO++ & BUSCAR EN ELEMENTOS HIJOS DE ROOT
				return 2;
			}
		} else if (nodeList[0].type === TypeElement.CURRENT) {
			// NODO++ & BUSCAR EN ELEMENTOS | ATRIBUTOS DE ROOT
			if (
				nodeList[1].name === root.identificador ||
				nodeList[1].type === TypeElement.ALL
			)
				return 3;
		} else if (nodeList[0].type === TypeElement.ALL) {
			// NODO++ & BUSCAR EN ELEMENTOS | ATRIBUTOS DE ROOT
			return 1;
		}

		// ROOT NO COINCIDE
		return 0;
	}

	searchElement(rootXML: any, nodeList: Element[], index: number): any {
		if (nodeList[index].type === TypeElement.ATRIBUTO) {
			rootXML.elements.forEach((element: Objeto) => {
				if (element.identificador === nodeList[index].name) {
					// IMPRIMIR ETIQUETA PADRE
					console.info(rootXML);
				}
			});
			return;
		} else {
		}
	}

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
				this.j = 1;
				this.graficarcst(this.listacst, this.j);
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

		let xmlcst = document.getElementById('arbolcst');
		if (xmlcst !== undefined && xmlcst !== null) {
			console.log('btn arbol cst Activo');
			xmlcst.addEventListener('click', () => {});
		}
	}
}
