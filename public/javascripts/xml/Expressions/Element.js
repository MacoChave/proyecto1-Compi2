"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
class Element {
    constructor(id, attributes, text, elements, line, column) {
        this.id = id;
        this.attributes = attributes;
        this.text = text;
        this.elements = elements;
        this.line = line;
        this.column = column;
    }
}
exports.Element = Element;
