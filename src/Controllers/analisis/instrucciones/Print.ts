import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import { BreadcrumbItem } from "react-bootstrap";

export default class Print extends Instruccion {
    private expresion: Instruccion
    private bandera: boolean

    constructor(exp: Instruccion,bandera:boolean ,linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.expresion = exp
        this.bandera = bandera
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor = this.expresion.interpretar(arbol, tabla)
        if (valor instanceof Errores) return valor
        if(this.bandera == true){
            arbol.Print(valor + "\n")
        }else{
            arbol.Print(valor)
        }
        
    }
}