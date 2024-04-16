import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";


export default class If extends Instruccion {
    private condicion: Instruccion
    private instruccionesif: Instruccion[]
    private instruccioneselse: Instruccion[]

    constructor(condicion: Instruccion, instrucciones1: Instruccion[],instrucciones2:Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.instruccionesif = instrucciones1
        this.instruccioneselse=instrucciones2

    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if (condicion instanceof Errores) return condicion

        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOLEAN) {
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("tabla IF")

        if (condicion) {
            for (let i of this.instruccionesif) {
                if (i instanceof Break) return i;
                let resultado = i.interpretar(arbol, newTabla)
                if (resultado instanceof Break) return;
            }
        }else{
            if(this.instruccioneselse){
                for (let i of this.instruccioneselse) {
                        if (i instanceof Break) return i;
                        if (i instanceof Continue) return i;
                        let resultado = i.interpretar(arbol, newTabla)
                        if (resultado instanceof Break) return; }
            }else{
                console.log("Falta instrucciones")
            }
            
        }
    }
}