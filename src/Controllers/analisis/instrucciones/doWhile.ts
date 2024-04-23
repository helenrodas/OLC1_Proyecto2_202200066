import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Return from "./Return";

export default class doWhile extends Instruccion{
    private condicion:Instruccion
    private instruccion: Instruccion[]


    constructor(condicion: Instruccion, instruccion: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.instruccion = instruccion
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if (condicion instanceof Errores) return condicion

        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOLEAN) {
            arbol.Print("Error Semantico: La condicion debe ser bool. linea:"+ this.linea+" columna: " +(this.col+1));
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        do{
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Funcion do while")
            for (let i of this.instruccion) {
                if (i instanceof Break) return;
                if (i instanceof Continue) break;
                if (i instanceof Return) return i;
                let resultado = i.interpretar(arbol, newTabla)
                if (resultado instanceof Errores) return resultado;
                if (resultado instanceof Return) return resultado;
                if (resultado instanceof Break) return;
                if (resultado instanceof Continue) break;
                
                
            }

        }while(this.condicion.interpretar(arbol, tabla))

    }

    ArbolGraph(anterior: string): string {
        return "";
    }
}