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
                return this.length(Unico,arbol)
            case Operadores.SENT_TYPEOF:
                return this.type(Unico,arbol)
            case Operadores.SENT_TOSTRING:
                return this.setString(Unico,arbol)
            default:
                return new Errores("Semantico", "Casteo Invalido", this.linea, this.col)
        }
    }

    // modifcar pues puede venir un vector, una lista tambien
    length(op1: any,arbol:Arbol) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.STRING:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return op1.length;
            default:
                arbol.Print("Error Semantico: o se puede ejecutar funcion length:" + this.linea+" columna: " +(this.col+1));
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
    type(op1: any,arbol:Arbol) {
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
                arbol.Print("Error Semantico: No se puede conocer el tipo"+ op1 + this.linea+" columna: " +(this.col+1));
                return new Errores("Semantico", "No se puede conocer el tipo: " + op1, this.linea, this.col)
        }
    }

    setString(op1: any,arbol:Arbol) {
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
                    arbol.Print("Error Semantico: No se puede convertir a string:"+ op1 + this.linea+" columna: " +(this.col+1));
                    return new Errores("Semantico", "No se puede convertir a string: " + op1, this.linea, this.col)
        }
    }

    ArbolGraph(anterior: string): string {

        let indice = Contador.getInstancia();
        let resultado = "";

        if(this.operacion == Operadores.SENT_LENGTH){

            let nativa = `n${indice.get()}`;
            let expr = `n${indice.get()}`;
            let punto = `n${indice.get()}`;
            let operUnico = `n${indice.get()}`;
            let par1 = `n${indice.get()}`;
            let par2 = `n${indice.get()}`;
            let puntocoma = `n${indice.get()}`;
    
            resultado += `${nativa}[label="Nativas"];\n`;
            resultado += `${expr}[label="Expresion"];\n`;
            resultado += `${punto}[label="."];\n`;
            resultado += `${operUnico}[label="length"];\n`;
            resultado += `${par1}[label="("];\n`;
            resultado += `${par2}[label=")"];\n`;
            resultado += `${puntocoma}[label=";"];\n`;

            resultado += `${anterior} -> ${nativa};\n`;
            resultado += `${nativa} -> ${expr}\n;`;
            resultado += `${nativa} -> ${punto}\n;`;
            resultado += `${nativa} -> ${operUnico};\n`;
            resultado += `${nativa} -> ${par1}\n;`;
            resultado += `${nativa} -> ${par2}\n;`;
            resultado += `${nativa} -> ${puntocoma};\n`;

            resultado += this.operandoUnico?.ArbolGraph(expr);

        }else if(this.operacion == Operadores.SENT_TYPEOF){

            let nativa = `n${indice.get()}`;
            let operUnico = `n${indice.get()}`;
            let par1 = `n${indice.get()}`;
            let expr = `n${indice.get()}`;
            let par2 = `n${indice.get()}`;
            let puntocoma = `n${indice.get()}`;

            resultado += `${nativa}[label="Nativas"];\n`;
            resultado += `${operUnico}[label="typeof"];\n`;
            resultado += `${par1}[label="("];\n`;
            resultado += `${expr}[label="Expresion"];\n`;
            resultado += `${par2}[label=")"];\n`;
            resultado += `${puntocoma}[label=";"];\n`;

            resultado += `${anterior} -> ${nativa};\n`;
            resultado += `${nativa} -> ${operUnico};\n`;
            resultado += `${nativa} -> ${par1};\n`;
            resultado += `${nativa} -> ${expr};\n`;
            resultado += `${nativa} -> ${par2};\n`;
            resultado += `${nativa} -> ${puntocoma};\n`;

            resultado += this.operandoUnico?.ArbolGraph(expr);

        }else if(this.operacion == Operadores.SENT_TOSTRING){

            let nativa = `n${indice.get()}`;
            let std = `n${indice.get()}`;
            let dosp1 = `n${indice.get()}`;
            let dosp2 = `n${indice.get()}`;
            let operUnico = `n${indice.get()}`;
            let par1 = `n${indice.get()}`;
            let expr = `n${indice.get()}`;
            let par2 = `n${indice.get()}`;
            let puntocoma = `n${indice.get()}`;

            resultado += `${nativa}[label="Nativas"];\n`;
            resultado += `${std}[label="std"];\n`;
            resultado += `${dosp1}[label=":"];\n`;
            resultado += `${dosp2}[label=":"];\n`;
            resultado += `${operUnico}[label="toString"];\n`;
            resultado += `${par1}[label="("];\n`;
            resultado += `${expr}[label="Expresion"];\n`;
            resultado += `${par2}[label=")"];\n`;
            resultado += `${puntocoma}[label=";"];\n`;

            resultado += `${anterior} -> ${nativa};\n`;
            resultado += `${nativa} -> ${std};\n`;
            resultado += `${nativa} -> ${dosp1};\n`;
            resultado += `${nativa} -> ${dosp2};\n`;
            resultado += `${nativa} -> ${operUnico};\n`;
            resultado += `${nativa} -> ${par1};\n`;
            resultado += `${nativa} -> ${expr};\n`;
            resultado += `${nativa} -> ${par2};\n`;
            resultado += `${nativa} -> ${puntocoma};\n`;

            resultado += this.operandoUnico?.ArbolGraph(expr);

        }

        return resultado;
    }
}

export enum Operadores {
    SENT_LENGTH,
    SENT_TYPEOF,
    SENT_TOSTRING

}