import { AST } from '../AST/AST';
import { Environment } from '../AST/Environment';

export interface Instruction {
	line: number;
	column: number;

	eject(env: Environment, root: AST): any;
}
