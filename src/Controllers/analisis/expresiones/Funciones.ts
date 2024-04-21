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
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return  Math.round(op1)
            default:
                    return new Errores("Semantico", "No se puede castear a round: " + op1, this.linea, this.col)
        }
    }


    ArbolGraph(anterior: string): string {

        let indice = Contador.getInstancia();

        let resultado = "";

        if(this.operacion == Operadores.SENT_TOUPPER){

            let opNativa = `n${indice.get()}`;

            let opUnico = `n${indice.get()}`;
            
            let par_izq = `n${indice.get()}`;
            let expresion = `n${indice.get()}`;
            
            let par_der = `n${indice.get()}`;
            
            let puntocoma = `n${indice.get()}`;

            resultado += `${opNativa}[label="Nativa"];\n`;
            resultado += `${opUnico}[label="toUpper"];\n`;
            resultado += `${par_izq}[label="("];\n`;
            resultado += `${expresion}[label="Expresion"];\n`;
            resultado += `${par_der}[label=")"];\n`;
            resultado += `${puntocoma}[label=";"];\n`;

            resultado += `${anterior} -> ${opNativa};\n`;
            resultado += `${opNativa} -> ${opUnico};\n`;
            resultado += `${opNativa} -> ${par_izq};\n`;
            resultado += `${opNativa} -> ${expresion};\n`;
            resultado += `${opNativa} -> ${par_der};\n`;
            resultado += `${opNativa} -> ${puntocoma};\n`;

            resultado += this.operandoUnico?.ArbolGraph(expresion);

        }else if(this.operacion == Operadores.SENT_TOLOWER){

            let opNativa = `n${indice.get()}`;
            let opUnico = `n${indice.get()}`;
            let par_izq = `n${indice.get()}`;
            let expresion = `n${indice.get()}`;
            let par_der = `n${indice.get()}`;
            let puntocoma = `n${indice.get()}`;

            resultado += `${opNativa}[label="Nativaa"];\n`;
            resultado += `${opUnico}[label="toLower"];\n`;
            resultado += `${par_izq}[label="("];\n`;
            resultado += `${expresion}[label="Expresion"];\n`;
            resultado += `${par_der}[label=")"];\n`;
            resultado += `${puntocoma}[label=";"];\n`;

            resultado += `${anterior} -> ${opNativa};\n`;
            resultado += `${opNativa} -> ${opUnico};\n`;
            resultado += `${opNativa} -> ${par_izq};\n`;
            resultado += `${opNativa} -> ${expresion};\n`;
            resultado += `${opNativa} -> ${par_der};\n`;
            resultado += `${opNativa} -> ${puntocoma};\n`;

            resultado += this.operandoUnico?.ArbolGraph(expresion);
			}else if(this.operacion == Operadores.SENT_ROUND){

            let opNativa = `n${indice.get()}`;
            let opUnico = `n${indice.get()}`;
            let par_izq = `n${indice.get()}`;
            let expresion = `n${indice.get()}`;
            let par_der = `n${indice.get()}`;
            let puntocoma = `n${indice.get()}`;

            resultado += `${opNativa}[label="Nativas"];\n`;
            resultado += `${opUnico}[label="round"];\n`;
            resultado += `${par_izq}[label="("];\n`;
            resultado += `${expresion}[label="Expresion"];\n`;
            resultado += `${par_der}[label=")"];\n`;
            resultado += `${puntocoma}[label=";"];\n`;

            resultado += `${anterior} -> ${opNativa};\n`;
            resultado += `${opNativa} -> ${opUnico};\n`;
            resultado += `${opNativa} -> ${par_izq};\n`;
            resultado += `${opNativa} -> ${expresion};\n`;
            resultado += `${opNativa} -> ${par_der};\n`;
            resultado += `${opNativa} -> ${puntocoma};\n`;

            resultado += this.operandoUnico?.ArbolGraph(expresion);
        }
        return resultado
    }
}

export enum Operadores {
    SENT_TOLOWER,
    SENT_TOUPPER,
    SENT_ROUND
}