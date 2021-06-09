import { AST } from '../AST/AST';
import { Environment } from '../AST/Environment';
import { Type } from '../AST/Type';

export interface XMLNode {
	line: number;
	column: number;

	getType(env: Environment, root: AST): Type;
	getValue(env: Environment, root: AST): any;
}
