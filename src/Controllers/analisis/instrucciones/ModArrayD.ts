import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Return from "./Return";
import Contador from "../simbolo/Contador";
import Simbolo from "../simbolo/Simbolo";




export default class  ModArrayU extends Instruccion{
    private primeraPos: Instruccion;
    private SgundaPos: Instruccion;
    private id: string;
    private Modificacion:Instruccion;
    

    constructor(id:string,primeraPos:Instruccion,SgundaPos:Instruccion,Modificacion:Instruccion,linea:number,col:number){
        super(new Tipo(tipoDato.VOID), linea, col);
        this.id = id;
        this.primeraPos = primeraPos
        this.SgundaPos = SgundaPos
        this.Modificacion = Modificacion
        
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorVariable= tabla.getVariable(this.id);
        
        let ubicacion1 = this.primeraPos.interpretar(arbol,tabla)
        
        
        let ubicacion2 = this.SgundaPos.interpretar(arbol,tabla)

        if (valorVariable === null) {
            arbol.Print("Error Semantico: "+"Variable no definida " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Variable no definida", this.linea, this.col);
        }

        const valorVector = valorVariable.getValor();
        this.tipoDato = valorVariable.getTipo()

        let nuevoValor = this.Modificacion.interpretar(arbol,tabla)

        if(nuevoValor instanceof Errores) return nuevoValor

        if (!Array.isArray(valorVector)) {

            arbol.Print("Error Semantico: "+"Variable no definida " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Variable no definida", this.linea, this.col);
        }

        

        if (ubicacion2 < 0 || ubicacion2 >= valorVector.length) {
            
            arbol.Print("Error Semantico: "+"La posicion esta fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La posicion esta fuera de rango", this.linea, this.col);
        }

        if (ubicacion1 < 0 || ubicacion1 >= valorVector.length) {

            arbol.Print("Error Semantico: "+"La posicion esta fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La posicion esta fuera de rango", this.linea, this.col);
        }

        valorVector[ubicacion1][ubicacion2] = nuevoValor;
    }

    ArbolGraph(anterior: string): string {
        return ''
    }
}