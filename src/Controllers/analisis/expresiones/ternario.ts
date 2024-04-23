import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";

export default class Ternario extends Instruccion {
    private condicion: Instruccion
    private op1: Instruccion
    private op2: Instruccion

    constructor(condicion: Instruccion, op1: Instruccion,op2: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.op1 = op1
        this.op2 = op2 
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol,tabla)
        if(condicion instanceof Errores) return condicion

        let operacion1 = this.op1.interpretar(arbol,tabla)
        if(operacion1 instanceof Errores) return operacion1

        let operacion2 = this.op2.interpretar(arbol,tabla)
        if(operacion2 instanceof Errores) return operacion2

        if(this.condicion.tipoDato.getTipo() != tipoDato.BOOLEAN){
            arbol.Print("Error Semantico: El tipo de la condicion es invalido" + this.linea+" columna: " +(this.col+1));
            return new Errores("Semantico", "El tipo de la condicion es invalido",this.linea,this.col)
        } 
            if(condicion){
                this.tipoDato = this.op1.tipoDato
                return operacion1
            }else{
                this.tipoDato = this.op2.tipoDato
                return operacion2
            }
        }

    ArbolGraph(anterior: string): string {
        return "";
    }
}