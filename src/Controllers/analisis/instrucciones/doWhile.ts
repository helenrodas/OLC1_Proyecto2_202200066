import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";

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

        // validaciones
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOLEAN) {
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        //comienza hacer el do while

        do{
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Funcion do while")
            for (let i of this.instruccion) {
                if (i instanceof Break) return;
                let resultado = i.interpretar(arbol, newTabla)
                if (resultado instanceof Break) return;
                // errores pendientes
            }

        }while(this.condicion.interpretar(arbol, tabla))

        
    }
}