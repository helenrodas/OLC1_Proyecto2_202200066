import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class Logicos extends Instruccion {
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
            case Operadores.OR:
                return this.comparacion_or(opIzq, opDer)
            case Operadores.AND:
                return this.comparacion_and(opIzq, opDer)
            case Operadores.NOT:
                return this.comparacion_not(Unico)
            default:
                return new Errores("Semantico", "Operador logico Invalido", this.linea, this.col)
        }
    }

    comparacion_or(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        return op1 || op2
                    default:
                        return new Errores("Semantico", "No se puede operar boolean con: " + op2, this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "comparacion or Invalida", this.linea, this.col)
        }
    }

    comparacion_and(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        return op1 && op2
                    default:
                        return new Errores("Semantico", "No se puede operar boolean con: " + op2, this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "comparacion and Invalida", this.linea, this.col)
        }
    }

    comparacion_not(op1: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()      
            if (typeof op1 === 'boolean') {
                return !op1;
            } else {
                return new Errores("Semantico", "comparacion not Invalida", this.linea, this.col)
            }
    }
}

export enum Operadores {
    OR,
    AND,
    NOT,
}