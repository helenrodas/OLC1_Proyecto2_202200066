import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class IncreDecre extends Instruccion {
    private id: string;
    private instruc: boolean;

    constructor(id: string, linea: number, columna: number, instruc: boolean) {
        super(new Tipo(tipoDato.VOID), linea, columna);
        this.id = id;
        this.instruc = instruc;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //console.log("paso por aquiii")
        let valor = tabla.getVariable(this.id.toLocaleLowerCase());
        if (valor == null) return new Errores("SEMANTICO", "No existe variable", this.linea, this.col)
        //console.log("el valor es:",valor.getTipo().getTipo());
        if (valor.getTipo().getTipo() != tipoDato.INTEGER) return new Errores("SEMANTICO", "Variable invalida para operar", this.linea, this.col);
        if (this.instruc == true) {
            valor.setValor(parseInt(valor.getValor()) + 1);
        } else {
            valor.setValor(parseInt(valor.getValor()) - 1);
        }
    }
}