import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";


export default class Funciones extends Instruccion {
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


    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let result = "";

        if(this.operacion == Operadores.SENT_TOUPPER){

            let nativa = `n${contador.get()}`;
            let operUnico = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let expr = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntocoma = `n${contador.get()}`;

            result += `${nativa}[label="Nativas"];\n`;
            result += `${operUnico}[label="toUpper"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${expr}[label="Expresion"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntocoma}[label=";"];\n`;

            result += `${anterior} -> ${nativa};\n`;
            result += `${nativa} -> ${operUnico};\n`;
            result += `${nativa} -> ${par1};\n`;
            result += `${nativa} -> ${expr};\n`;
            result += `${nativa} -> ${par2};\n`;
            result += `${nativa} -> ${puntocoma};\n`;

            result += this.operandoUnico?.ArbolGraph(expr);

        }else if(this.operacion == Operadores.SENT_TOLOWER){

            let nativa = `n${contador.get()}`;
            let operUnico = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let expr = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntocoma = `n${contador.get()}`;

            result += `${nativa}[label="Nativas"];\n`;
            result += `${operUnico}[label="toLower"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${expr}[label="Expresion"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntocoma}[label=";"];\n`;

            result += `${anterior} -> ${nativa};\n`;
            result += `${nativa} -> ${operUnico};\n`;
            result += `${nativa} -> ${par1};\n`;
            result += `${nativa} -> ${expr};\n`;
            result += `${nativa} -> ${par2};\n`;
            result += `${nativa} -> ${puntocoma};\n`;

            result += this.operandoUnico?.ArbolGraph(expr);
			}else if(this.operacion == Operadores.SENT_ROUND){

            let nativa = `n${contador.get()}`;
            let operUnico = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let expr = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntocoma = `n${contador.get()}`;

            result += `${nativa}[label="Nativas"];\n`;
            result += `${operUnico}[label="round"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${expr}[label="Expresion"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntocoma}[label=";"];\n`;

            result += `${anterior} -> ${nativa};\n`;
            result += `${nativa} -> ${operUnico};\n`;
            result += `${nativa} -> ${par1};\n`;
            result += `${nativa} -> ${expr};\n`;
            result += `${nativa} -> ${par2};\n`;
            result += `${nativa} -> ${puntocoma};\n`;

            result += this.operandoUnico?.ArbolGraph(expr);
        }
        return result
    }
}

export enum Operadores {
    SENT_TOLOWER,
    SENT_TOUPPER,
    SENT_ROUND
}