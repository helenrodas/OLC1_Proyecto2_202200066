import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Contador from "../simbolo/Contador";


export default class Continue extends Instruccion {
    constructor(linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return;
    }
    
    ArbolGraph(anterior: string): string {


        let contador = Contador.getInstancia();
        let result = "";

        let continuear = `n${contador.get()}`;
        let puntocoma = `n${contador.get()}`;

        result += `${continuear}[label="continue"];\n`;
        result += `${puntocoma}[label=";"];\n`;

        result += `${anterior} -> ${continuear};\n`;
        result += `${anterior} -> ${puntocoma};\n`;

        return result;
    }
}