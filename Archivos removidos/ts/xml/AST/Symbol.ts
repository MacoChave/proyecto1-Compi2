import { XMLNode } from '../interfaces/XMLNode';
import { AST } from './AST';
import { Environment } from './Environment';
import { Type } from './Type';

export class Symbol implements XMLNode {
	public id: string;
	private value: any;
	private type: Type;
	line: number;
	column: number;

	constructor(type: Type, id: string, line: number, column: number) {
		this.id = id;
		this.line = line;
		this.column = column;
		this.type = type;
	}

	getType(env: Environment, root: AST): Type {
		return this.type;
	}

	getValue(env: Environment, root: AST) {
		return this.value;
	}
}
