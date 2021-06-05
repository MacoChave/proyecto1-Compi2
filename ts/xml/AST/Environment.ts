import { Symbol } from './Symbol';

export class Environment {
	private lastEnv: Environment;
	private table: { [id: string]: Symbol };

	constructor(lastEnv: any) {
		this.lastEnv = lastEnv;
		this.table = {};
	}

	add(id: string, symbol: Symbol) {
		id = id.toLowerCase();
		symbol.id = symbol.id.toLowerCase();
		this.table[id] = symbol;
	}

	delete(id: string): boolean {
		id = id.toLowerCase();
		for (let e: Environment = this; e != null; e = e.lastEnv) {
			const value = e.table[id];
			if (value !== undefined) {
				delete e.table[id];
				return true;
			}
		}

		return false;
	}

	exist(id: string): boolean {
		id = id.toLowerCase();
		for (let e: Environment = this; e != null; e = e.lastEnv) {
			const value = e.table[id];
			if (value !== undefined) return true;
		}

		return false;
	}

	getSymbol(id: string): any {
		id = id.toLowerCase();
		for (let e: Environment = this; e != null; e = e.lastEnv) {
			if (e.table[id] !== undefined) return e.table[id];
		}

		return null;
	}

	replace(id: string, newValue) {
		id = id.toLowerCase();
		for (let e: Environment = this; e != null; e = e.lastEnv) {
			const value = e.table[id];
			if (value !== undefined) {
				e.table[id] = newValue;
			}
		}
	}
}
