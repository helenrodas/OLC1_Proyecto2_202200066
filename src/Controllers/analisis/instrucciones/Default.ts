import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";

export default class Default extends Instruccion {
    private instrucciones: Instruccion[]
    
    constructor(instrucciones: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("tabla Default")

        
        for (let i of this.instrucciones) {
            if (i instanceof Break) return i;
            let resultado = i.interpretar(arbol, newTabla)
            if (resultado instanceof Break) return resultado;
        }
    }
}