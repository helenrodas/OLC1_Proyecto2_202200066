import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";

export default class For extends Instruccion{
    private condicion: Instruccion;
    private instrucciones: Instruccion[];
    private inc_dec: Instruccion;
    private variable: Instruccion

    constructor(variable: Instruccion,condicion: Instruccion, inc_dec: Instruccion,insctrucciones: Instruccion[], linea: number, columna: number){
        super(new Tipo(tipoDato.VOID), linea, columna);
        this.variable = variable;
        this.condicion = condicion;
        this.instrucciones = insctrucciones;
        this.inc_dec = inc_dec;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let tablaTemp  = new tablaSimbolo(tabla);

        this.variable.interpretar(arbol, tablaTemp);
        
        let cond = this.condicion.interpretar(arbol, tablaTemp);
        if(cond instanceof Errores) return cond;

        if(this.condicion.tipoDato.getTipo()!= tipoDato.BOOLEAN){
            return new Errores("Semantico", "La condicion debe ser bool", this.linea, this.col);
        }

        while(this.condicion.interpretar(arbol,tablaTemp)){
            let nuevaTabla = new tablaSimbolo(tablaTemp);
            nuevaTabla.setNombre("tabla For");
            for(let i of this.instrucciones){
                if(i instanceof Break) return;
                if (i instanceof Continue) break;
                let resultado = i.interpretar(arbol, nuevaTabla);
                if(resultado instanceof Break) return;
                if (i instanceof Continue) break;
            }
            this.inc_dec.interpretar(arbol, nuevaTabla);
        }

    }
}