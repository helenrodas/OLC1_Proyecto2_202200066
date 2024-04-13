import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class IncDec extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: Tipo
    private operandoUnico: Instruccion | undefined

    constructor(operador: Tipo, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
        super(new Tipo(tipoDato.VOID), fila, col)
        this.operacion = operador
        if (!op2) this.operandoUnico = op1
        else {
            this.operando1 = op1
            this.operando2 = op2
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq, opDer, Unico = null
        if (this.operandoUnico != null) {
            Unico = this.operandoUnico.interpretar(arbol, tabla)
            if (Unico instanceof Errores) return Unico
        } else {
            opIzq = this.operando1?.interpretar(arbol, tabla)
            if (opIzq instanceof Errores) return opIzq
            opDer = this.operando2?.interpretar(arbol, tabla)
            if (opDer instanceof Errores) return opDer
        }

        switch (this.operacion.getTipo()) {
            case tipoDato.INCREMENTO:
                return this.incremento(Unico)
            case tipoDato.DECREMENTO:
                return this.decremento(Unico)
            default:
                return new Errores("Semantico", "Casteo Invalido", this.linea, this.col)
        }
    }
    incremento(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        let opresult = 0
        switch (tipo1) {
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                opresult = op1++;
                console.log(opresult)
                console.log(op1)
                return  op1++;
            default:
                    return new Errores("Semantico", "No se puede incrementar: " + op1, this.linea, this.col)
        }
    }

    decremento(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        let opresult = 0
        switch (tipo1) {
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                opresult = op1--;
                console.log(opresult)
                console.log(op1)
                return  op1--;
            default:
                    return new Errores("Semantico", "No se puede decrementar: " + op1, this.linea, this.col)
        }
    }
}

export enum Operadores {
    INCREMENTO,
    DECREMENTO
}