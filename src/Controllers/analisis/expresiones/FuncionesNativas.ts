import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";


export default class FuncionesNativas extends Instruccion {
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
            case Operadores.SENT_LENGTH:
                if(Array.isArray(Unico)){
                    return this.arreglo(Unico);
                }
                return this.length(Unico)
            case Operadores.SENT_TYPEOF:
                return this.type(Unico)
            case Operadores.SENT_TOSTRING:
                return this.setString(Unico)
            default:
                return new Errores("Semantico", "Casteo Invalido", this.linea, this.col)
        }
    }

    // modifcar pues puede venir un vector, una lista tambien
    length(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.STRING:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return op1.length;
            default:
                    return new Errores("Semantico", "No se puede ejecutar funcion length: " + op1, this.linea, this.col)
        }
    }

    arreglo(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return op1.length;
            case tipoDato.DOUBLE:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return op1.length;
            case tipoDato.STRING:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return op1.length;
            case tipoDato.BOOLEAN:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return op1.length;
            case tipoDato.CHAR:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return op1.length;
            default:
                    return new Errores("Semantico", "No se puede ejecutar funcion arreglo : " + op1, this.linea, this.col)
        }
    }

    //falta agregar caso que venga vector
    type(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.STRING:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return "cadena"
            case tipoDato.DOUBLE:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return "double"
            case tipoDato.BOOLEAN:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return "bool"
            case tipoDato.CHAR:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return "char"
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return "int"
            default:
                    return new Errores("Semantico", "No se puede conocer el tipo: " + op1, this.linea, this.col)
        }
    }

    setString(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return  op1.toString();
            case tipoDato.DOUBLE:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return  op1.toString();
            case tipoDato.BOOLEAN:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return  op1.toString();
            default:
                    return new Errores("Semantico", "No se puede convertir a string: " + op1, this.linea, this.col)
        }
    }

    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let result = "";

        if(this.operacion == Operadores.SENT_LENGTH){

            let nativa = `n${contador.get()}`;
            let expr = `n${contador.get()}`;
            let punto = `n${contador.get()}`;
            let operUnico = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntocoma = `n${contador.get()}`;
    
            result += `${nativa}[label="Nativas"];\n`;
            result += `${expr}[label="Expresion"];\n`;
            result += `${punto}[label="."];\n`;
            result += `${operUnico}[label="length"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntocoma}[label=";"];\n`;

            result += `${anterior} -> ${nativa};\n`;
            result += `${nativa} -> ${expr}\n;`;
            result += `${nativa} -> ${punto}\n;`;
            result += `${nativa} -> ${operUnico};\n`;
            result += `${nativa} -> ${par1}\n;`;
            result += `${nativa} -> ${par2}\n;`;
            result += `${nativa} -> ${puntocoma};\n`;

            result += this.operandoUnico?.ArbolGraph(expr);

        }else if(this.operacion == Operadores.SENT_TYPEOF){

            let nativa = `n${contador.get()}`;
            let operUnico = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let expr = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntocoma = `n${contador.get()}`;

            result += `${nativa}[label="Nativas"];\n`;
            result += `${operUnico}[label="typeof"];\n`;
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

        }else if(this.operacion == Operadores.SENT_TOSTRING){

            let nativa = `n${contador.get()}`;
            let std = `n${contador.get()}`;
            let dosp1 = `n${contador.get()}`;
            let dosp2 = `n${contador.get()}`;
            let operUnico = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let expr = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntocoma = `n${contador.get()}`;

            result += `${nativa}[label="Nativas"];\n`;
            result += `${std}[label="std"];\n`;
            result += `${dosp1}[label=":"];\n`;
            result += `${dosp2}[label=":"];\n`;
            result += `${operUnico}[label="toString"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${expr}[label="Expresion"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntocoma}[label=";"];\n`;

            result += `${anterior} -> ${nativa};\n`;
            result += `${nativa} -> ${std};\n`;
            result += `${nativa} -> ${dosp1};\n`;
            result += `${nativa} -> ${dosp2};\n`;
            result += `${nativa} -> ${operUnico};\n`;
            result += `${nativa} -> ${par1};\n`;
            result += `${nativa} -> ${expr};\n`;
            result += `${nativa} -> ${par2};\n`;
            result += `${nativa} -> ${puntocoma};\n`;

            result += this.operandoUnico?.ArbolGraph(expr);

        }

        return result;
    }
}

export enum Operadores {
    SENT_LENGTH,
    SENT_TYPEOF,
    SENT_TOSTRING

}