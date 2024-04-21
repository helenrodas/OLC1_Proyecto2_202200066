import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";

export default class Break extends Instruccion {
    constructor(linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return;
    }

    ArbolGraph(anterior: string): string {

        let indice = Contador.getInstancia();
        let resultado = "";

        let breakk = `n${indice.get()}`;
        let puntocoma = `n${indice.get()}`;


        resultado += `${breakk}[label="Break"];\n`;
        resultado += `${puntocoma}[label=";"];\n`;

        resultado += `${anterior} -> ${breakk};\n`;
        resultado += `${anterior} -> ${puntocoma};\n`;

        return resultado;
    }
}