import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";

export default class AccesoVar extends Instruccion {
    private id: string
    private datoEncontrado: any | null = null;

    constructor(id: string, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.id = id
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorVariable: Simbolo =<Simbolo> tabla.getVariable(this.id)
        if (valorVariable == null){
            arbol.Print("Error Semantico: "+"Acceso a variable invalido " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Acceso a variable invalido", this.linea, this.col)
        } 
        this.tipoDato = valorVariable.getTipo()
        this.datoEncontrado = valorVariable.getValor()
        return this.datoEncontrado
    }

    ArbolGraph(anterior: string): string {

        let result = "";
        let contador = Contador.getInstancia();

        let declar = `n${contador.get()}`;

        result += ` ${declar}[label="${this.datoEncontrado}"];\n`;

        result += ` ${anterior} -> ${declar};\n`;

        return result;
    }
}