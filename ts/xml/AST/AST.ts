import { Instruction } from '../interfaces/Instruction';

export class AST {
	public instructions: Array<Instruction>;

	constructor(instructions: Array<Instruction>) {
		this.instructions = instructions;
	}
}
