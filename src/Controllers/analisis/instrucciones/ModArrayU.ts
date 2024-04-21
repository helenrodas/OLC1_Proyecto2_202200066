import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Contador from "../simbolo/Contador";

export default class  ModArrayU extends Instruccion{
    private id: string;
    private ubicacion: Instruccion;
    private modificacion:Instruccion;

    constructor(id:string,ubicacion:Instruccion,modificacion:Instruccion,linea:number,col:number){
        super(new Tipo(tipoDato.VOID), linea, col);
        this.id = id;
        this.ubicacion = ubicacion
        this.modificacion = modificacion
    }
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        let variable= tabla.getVariable(this.id);
        let posicionVector = this.ubicacion.interpretar(arbol,tabla)

        if (variable === null) {
            arbol.Print("Error Semantico: "+"Variable no definida " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Variable no definida", this.linea, this.col);
        }

        const varVector = variable.getValor();
        this.tipoDato = variable.getTipo()

        let nuevoValor = this.modificacion.interpretar(arbol,tabla)

        if (!Array.isArray(varVector)) {
            arbol.Print("Error Semantico: " + " La variable no esta definida para un vector" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La variable no esta definida para un vector", this.linea, this.col);
        }

        if (posicionVector < 0 || posicionVector >= varVector.length) {
            arbol.Print("Error Semantico: "+"La posicion esta fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La posicion esta fuera de rango ", this.linea, this.col);
        }
        varVector[posicionVector] = nuevoValor;
    }

    ArbolGraph(anterior: string): string {
        return "";
    }
}