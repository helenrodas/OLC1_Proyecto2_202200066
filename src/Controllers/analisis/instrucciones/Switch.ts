import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Case from "../instrucciones/Case";
import Default from "../instrucciones/Default";

export default class Switch extends Instruccion {
    private condicion: Instruccion
    private listaCase: Case[]
    private casoDefault: Default | undefined

    constructor(condicion: Instruccion, listaCase: Case[], linea: number, col: number,casoDefault?:Default) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.listaCase = listaCase
        this.casoDefault=casoDefault

    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if (condicion instanceof Errores) return condicion

        // Verificar si algun caso se cumple
        //let casoCumplido = false;

        for (let caso of this.listaCase) {
            let casoTemp = caso.condicion.interpretar(arbol,tabla)
            if (casoTemp instanceof Errores) return casoTemp
            if (casoTemp == condicion) {
                let resultado = caso.interpretar(arbol, tabla)
                if (resultado instanceof Break) return;
                //casoCumplido = true;
            
            }
        }

        // Si ningun caso se cumplio y hay un caso default, ejecutarlo
        if (this.casoDefault) {
           let resultado = this.casoDefault.interpretar(arbol, tabla);
           if (resultado instanceof Break) return;
        }
    }

}