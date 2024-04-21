import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Contador from "../simbolo/Contador";
import Return from "./Return";

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
            arbol.Print("Error Semantico: La condicion debe ser bool. linea:"+ this.linea+" columna: " +(this.col+1));
            return new Errores("Semantico", "La condicion debe ser bool", this.linea, this.col);
        }

        while(this.condicion.interpretar(arbol,tablaTemp)){
            let nuevaTabla = new tablaSimbolo(tablaTemp);
            nuevaTabla.setNombre("tabla For");
            for(let i of this.instrucciones){
                if(i instanceof Break) return;
                if (i instanceof Continue) break;
                let resultado = i.interpretar(arbol, nuevaTabla);
                if (resultado instanceof Return) return resultado;
                if(resultado instanceof Break) return;
                if (i instanceof Continue) break;
            }
            this.inc_dec.interpretar(arbol, nuevaTabla);
        }

    }

    ArbolGraph(anterior: string): string {

        let indice = Contador.getInstancia();
        let result = "";
        let contenedorIns = [];

        let padre = `n${indice.get()}`;
        let nFor = `n${indice.get()}`;
        let par1 = `n${indice.get()}`;
        let decl = `n${indice.get()}`;
        let cond = `n${indice.get()}`;
        let inc = `n${indice.get()}`;
        let par2 = `n${indice.get()}`;
        let llav1 = `n${indice.get()}`;
        let padreIns = `n${indice.get()}`;

        for(let i = 0; i < this.instrucciones.length; i++){
            contenedorIns.push(`n${indice.get()}`);
        }

        let llav2 = `n${indice.get()}`;

        result += `${padre}[label="ciclo"];\n`;
        result += `${nFor}[label="for"];\n`;
        result += `${par1}[label="("];\n`;
        result += `${decl}[label="expresion"];\n`;
        result += `${cond}[label="condicion"];\n`; 
        result += `${inc}[label="expresion"];\n`;
        result += `${par2}[label=")"];\n`;
        result += `${llav1}[label="{"];\n`;
        result += `${padreIns}[label="Instrucciones"];\n`;

        for(let i = 0; i < contenedorIns.length; i++){
            result += ` ${contenedorIns[i]}[label="Instruccion"];\n`;
        }

        result += `${llav2}[label="}"];\n`;

        result += `${anterior} -> ${padre};\n`;
        result += `${padre} -> ${nFor};\n`;
        result += `${padre} -> ${par1};\n`;
        result += `${padre} -> ${decl};\n`;
        result += `${padre} -> ${cond};\n`;
        result += `${padre} -> ${inc};\n`;
        result += `${padre} -> ${par2};\n`;
        result += `${padre} -> ${llav1};\n`;
        result += `${padre} -> ${padreIns};\n`;

        for(let i = 0; i < contenedorIns.length; i++){
            result += `${padreIns} -> ${contenedorIns[i]};\n`;
        }

        result += `${padre} -> ${llav2};\n`;

        result += this.variable.ArbolGraph(decl);
        result += this.condicion.ArbolGraph(cond);
        result += this.inc_dec.ArbolGraph(inc);

        for(let i = 0; i < contenedorIns.length; i++){
            result += this.instrucciones[i].ArbolGraph(contenedorIns[i]);
        }

        return result;
    }
}