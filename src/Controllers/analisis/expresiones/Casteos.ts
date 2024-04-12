import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class Casteos extends Instruccion {
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
            case tipoDato.INTEGER:
                //console.log(Unico)
                return this.casteo_int(Unico)
            // case Operadores.DIFERENCIACION:
            //     return this.diferenciacion(opIzq, opDer)
            // case Operadores.MENOR:
            //     return this.menor_que(opIzq, opDer)
            // case Operadores.MENORIGUAL:
            //     return this.menor_igual(opIzq, opDer)
            // case Operadores.MAYOR:
            //     return this.mayor_que(opIzq, opDer)
            // case Operadores.MAYORIGUAL:
            //     return this.mayor_igual(opIzq,opDer)
            default:
                return new Errores("Semantico", "Casteo Invalido", this.linea, this.col)
        }
    }

    casteo_int(op1: any) {
        // console.log(op1)
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.DOUBLE:
                console.log(op1)
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return parseInt(op1)
            
        
            case tipoDato.CHAR:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return parseInt(op1.charCodeAt(1))
        }
    }

}

export enum Operadores {
    INTEGER,
    DOUBLE
}