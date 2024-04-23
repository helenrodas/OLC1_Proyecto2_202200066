import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";


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

        //(int) 12.4
        //(string) 20
        switch (this.operacion.getTipo()) {
            case tipoDato.INTEGER:
                return this.casteo_int(Unico)
            case tipoDato.DOUBLE:
                return this.casteo_double(Unico)
            case tipoDato.STRING:
                return this.casteo_string(Unico)
            case tipoDato.CHAR:
                return this.casteo_char(Unico)
            default:
                arbol.Print("Error Semantico: Casteo Invalido linea:"+ this.linea+" columna: " +(this.col+1));
                return new Errores("Semantico", "Casteo Invalido", this.linea, this.col)
        }
    }

    casteo_int(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.DOUBLE:
                console.log(op1)
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return parseInt(op1)
        
            case tipoDato.CHAR:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return parseInt(op1.charCodeAt(1))
            default:
                    return new Errores("Semantico", "No se puede castear a entero: " + op1, this.linea, this.col)
        }
    }

    casteo_double(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.DOUBLE)
                return parseFloat(op1)
        
            case tipoDato.CHAR:
                this.tipoDato = new Tipo(tipoDato.DOUBLE)
                return parseFloat(op1.charCodeAt(1))
            default:
                    return new Errores("Semantico", "No se puede castear a double: " + op1, this.linea, this.col)
        }
    }

    casteo_string(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return op1.toString()
            
        
            case tipoDato.DOUBLE:
                this.tipoDato = new Tipo(tipoDato.STRING)
                return op1.toString()
            default:
                    return new Errores("Semantico", "No se puede castear a string: " + op1, this.linea, this.col)
        }
    }

    casteo_char(op1: any) {
        let tipo1 = this.operandoUnico?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.CHAR)
                return String.fromCharCode(op1);
            default:
                    return new Errores("Semantico", "No se puede castear a char: " + op1, this.linea, this.col)
        }
    }

    ArbolGraph(anterior: string): string {


        let contador = Contador.getInstancia();
        let resultado = "";

        let casteoInit = `n${contador.get()}`;
        
        let par1 = `n${contador.get()}`;
        let tipo = `n${contador.get()}`;
        
        let par2 = `n${contador.get()}`;
        let valor = `n${contador.get()}`;
        
        let puntocoma = `n${contador.get()}`;

        resultado += `${casteoInit}[label="casteo"];\n`;
        resultado += `${par1}[label="("];\n`;
        if(this.tipoDato.getTipo() == tipoDato.INTEGER){
            resultado += `${tipo}[label="int"];\n`;
        }else if(this.tipoDato.getTipo() == tipoDato.DOUBLE){
            resultado += `${tipo}[label="double"];\n`;
        }else if(this.tipoDato.getTipo() == tipoDato.CHAR){
            resultado += `${tipo}[label="char"];\n`;
        }else if(this.tipoDato.getTipo() == tipoDato.STRING){
            resultado += `${tipo}[label="std::string"];\n`;
        }else if(this.tipoDato.getTipo() == tipoDato.BOOLEAN){
            resultado += `${tipo}[label="bool"];\n`;
        }

        resultado += `${par2}[label="("];\n`;
        
        
        resultado += `${valor}[label="Expresion"];\n`;
        resultado += `${puntocoma}[label=";"];\n`;


        resultado += `${anterior} -> ${casteoInit};\n`;
        
        resultado += `${casteoInit} -> ${par1};\n`;
    
        resultado += `${casteoInit} -> ${tipo};\n`;
        resultado += `${casteoInit} -> ${par2};\n`;
        
        resultado += `${casteoInit} -> ${valor};\n`;
        resultado += `${casteoInit} -> ${puntocoma};\n`;

        resultado += this.operandoUnico?.ArbolGraph(valor);

        return resultado;
    }
}

export enum Operadores {
    INTEGER,
    DOUBLE,
    STRING,
    CHAR
}