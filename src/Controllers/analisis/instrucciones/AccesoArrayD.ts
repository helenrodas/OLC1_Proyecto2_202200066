import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Return from "./Return";
import Contador from "../simbolo/Contador";
import Simbolo from "../simbolo/Simbolo";



export default class AccesoArrayD extends Instruccion {
    private index1: Instruccion;
    private index2: Instruccion;
    private id: string;

    constructor(id: string, index1: Instruccion, index2: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.id = id;
        this.index1 = index1;
        this.index2 = index2;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let variable= tabla.getVariable(this.id);
        let PrimeraPos = this.index1.interpretar(arbol,tabla)
        let SegundaPos = this.index2.interpretar(arbol,tabla)

        if (variable === null) {
            arbol.Print("Error Semantico:"+"Variable no definida" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Variable no definida", this.linea, this.col);
        }

        const varVector = variable.getValor();
        this.tipoDato = variable.getTipo()

        if (!Array.isArray(varVector)) {
            arbol.Print("Error Semantico: "+"Variable no definida " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Variable no definida", this.linea, this.col);
        }

        if (PrimeraPos < 0 || PrimeraPos >= varVector.length) {
            arbol.Print("Error Semantico: "+"La posicion esta fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La posicion esta fuera de rango", this.linea, this.col);
        }

        if (SegundaPos < 0 || SegundaPos >= varVector.length) {
            arbol.Print("Error Semantico: "+"La posicion esta fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La posicion esta fuera de rango", this.linea, this.col);
        }

        return varVector[PrimeraPos][SegundaPos];
    }
    
    ArbolGraph(anterior: string): string {
        return ''
    }
}