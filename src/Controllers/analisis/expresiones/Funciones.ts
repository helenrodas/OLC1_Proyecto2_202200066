import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class Casteos extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: Operadores
    private operandoUnico: Instruccion | undefined

    constructor(operador: Operadores, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
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

        switch (this.operacion) {
            case Operadores.SENT_TOLOWER:
                return this.casteo_lower(Unico)
            case Operadores.SENT_TOUPPER:
                return this.casteo_upper(Unico)
            case Operadores.SENT_ROUND:
                return this.casteo_round(Unico)
            // case tipoDato.CHAR:
            //     return this.casteo_char(Unico)
            default:
                return new Errores("Semantico", "Casteo Invalido", this.linea, this.col)
        }
    }

    casteo_lower(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.STRING:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return op1.toLowerCase()
            default:
                    return new Errores("Semantico", "No se puede castear ToLower: " + op1, this.linea, this.col)
        }
    }

    casteo_upper(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.STRING:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return op1.toUpperCase()
            default:
                    return new Errores("Semantico", "No se puede castear ToUpper: " + op1, this.linea, this.col)
        }
    }

    casteo_round(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.DOUBLE:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return  Math.round(op1)
            default:
                    return new Errores("Semantico", "No se puede castear a round: " + op1, this.linea, this.col)
        }
    }
}

export enum Operadores {
    SENT_TOLOWER,
    SENT_TOUPPER,
    SENT_ROUND
}