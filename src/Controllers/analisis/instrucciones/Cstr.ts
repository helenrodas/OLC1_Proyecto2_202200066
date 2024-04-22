import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";



export default class FunCsrt extends Instruccion{
    private tipo: Tipo;
    private identificador: string;
    private extension: string;


    constructor(tipo: Tipo, identificador: string, extension: string, linea: number, col: number) {
        super(tipo, linea, col);
        this.tipo = tipo;
        this.identificador = identificador;
        this.extension = extension;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let variable = tabla.getVariable(this.extension.toLocaleLowerCase());

        if (variable === null) {
            arbol.Print("\n Error Semantico:"+"Variable no esta definida " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
            return new Errores("SEMANTICO", "Variable no esta definida", this.linea, this.col)
        }

        if (variable.getTipo().getTipo() !== tipoDato.STRING) {
            arbol.Print("\n Error Semantico:"+"Variable no aceptada " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
            return new Errores("SEMANTICO", "Variable no aceptada", this.linea, this.col);
        }

        let arrayCaracteres: any = [];
        for (let i = 0; i < variable.getValor().length; i++) {
            arrayCaracteres[i] = variable.getValor().charAt(i);
        }

        
        if (!tabla.setVariable(new Simbolo(this.tipo, this.identificador, arrayCaracteres))) {
            arbol.Print("\n Error Semantico:"+"Variable ya existe " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
            return new Errores("SEMANTICO", "Variable ya existe", this.linea, this.col);
        }
    }

    ArbolGraph(anterior: string): string {
        return '';
    }
}