import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Contador from "../simbolo/Contador";

export default class AsignacionVar extends Instruccion {
    private id: string
    private exp: Instruccion

    constructor(id: string, exp: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.id = id
        this.exp = exp
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let NewValor = this.exp.interpretar(arbol, tabla)
        if (NewValor instanceof Errores) return NewValor

        let valor = tabla.getVariable(this.id.toLocaleLowerCase())
        if (valor == null){
            arbol.Print("\n Error Semantico:"+"Variable no existente " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
            return new Errores("SEMANTICO", "Variable no existente", this.linea, this.col)
            
        } 

        if (this.exp.tipoDato.getTipo() != valor.getTipo().getTipo()){
            arbol.Print("\n Error Semantico:"+"Asignacion de tipo de variable incorrecta " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
            return new Errores("SEMANTICO", "Asignacion incorrecta", this.linea, this.col)
        } 

        this.tipoDato = valor.getTipo()
        valor.setValor(NewValor)
    }

    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let result = "";


        let padre = `n${contador.get()}`;
        let variable = `n${contador.get()}`;
        let varNombre = `n${contador.get()}`;
        let igual = `n${contador.get()}`;
        let asignacion = `n${contador.get()}`;

        result += ` ${padre}[label="Asignacion"];\n`;
        result += `${variable}[label="ID"];\n`;
        result += `${varNombre}[label="${this.id}"];\n`;
        result += `${igual}[label="="];\n`;
        result += `${asignacion}[label="Expresion"];\n`;

        result += ` ${anterior} -> ${padre};\n`;
        result += `${padre} -> ${variable};\n`;
        result += `${variable} -> ${varNombre};\n`;
        result += `${padre} -> ${igual};\n`;
        result += `${padre} -> ${asignacion};\n`;

        result += this.exp.ArbolGraph(asignacion);

        return result;
    }
}