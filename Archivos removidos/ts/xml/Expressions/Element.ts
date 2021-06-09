import { Attribute } from './Attribute';

export class Element {
	id: string;
	text: string;
	attributes: Array<Attribute>;
	elements: Array<Element>;
	line: number;
	column: number;

	constructor(
		id: string,
		attributes: Array<Attribute>,
		text: string,
		elements: Array<Element>,
		line: number,
		column: number
	) {
		this.id = id;
		this.attributes = attributes;
		this.text = text;
		this.elements = elements;
		this.line = line;
		this.column = column;
	}
}
