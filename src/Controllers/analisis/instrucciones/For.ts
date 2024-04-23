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
                if(resultado instanceof Errores) return resultado;
                if (resultado instanceof Return) return resultado;
                if(resultado instanceof Break) return;
                if (i instanceof Continue) break;
            }
            this.inc_dec.interpretar(arbol, nuevaTabla);
        }

    }

    ArbolGraph(anterior: string): string {

        let indice = Contador.getInstancia();
        let resultado = "";
        let listaInstrucciones = [];

        let inicio = `n${indice.get()}`;
    
        let sentFor = `n${indice.get()}`;
        let parIzq = `n${indice.get()}`;
        let decl = `n${indice.get()}`;
    
        let cond = `n${indice.get()}`;
        let inc = `n${indice.get()}`;
   
        let parDer = `n${indice.get()}`;
        let llav1 = `n${indice.get()}`;
   
   
        let padreIns = `n${indice.get()}`;

        for(let i = 0; i < this.instrucciones.length; i++){
            listaInstrucciones.push(`n${indice.get()}`);
        }

        let llav2 = `n${indice.get()}`;

        resultado += `${inicio}[label="ciclo"];\n`;
        resultado += `${sentFor}[label="for"];\n`;
        
        resultado += `${parIzq}[label="("];\n`;
        resultado += `${decl}[label="expresion"];\n`;
        
        
        resultado += `${cond}[label="condicion"];\n`; 
        resultado += `${inc}[label="expresion"];\n`;
        resultado += `${parDer}[label=")"];\n`;
        resultado += `${llav1}[label="{"];\n`;
        resultado += `${padreIns}[label="Instrucciones"];\n`;

        for(let i = 0; i < listaInstrucciones.length; i++){
            resultado += ` ${listaInstrucciones[i]}[label="Instruccion"];\n`;
        }

        resultado += `${llav2}[label="}"];\n`;

        resultado += `${anterior} -> ${inicio};\n`;
        resultado += `${inicio} -> ${sentFor};\n`;
        resultado += `${inicio} -> ${parIzq};\n`;
    
    
        resultado += `${inicio} -> ${decl};\n`;
        resultado += `${inicio} -> ${cond};\n`;
    
        resultado += `${inicio} -> ${inc};\n`;
        resultado += `${inicio} -> ${parDer};\n`;
    
        resultado += `${inicio} -> ${llav1};\n`;
        resultado += `${inicio} -> ${padreIns};\n`;

        for(let i = 0; i < listaInstrucciones.length; i++){
            resultado += `${padreIns} -> ${listaInstrucciones[i]};\n`;
        }

        resultado += `${inicio} -> ${llav2};\n`;


        resultado += this.variable.ArbolGraph(decl);
        
        
        resultado += this.condicion.ArbolGraph(cond);
        resultado += this.inc_dec.ArbolGraph(inc);

        for(let i = 0; i < listaInstrucciones.length; i++){
            resultado += this.instrucciones[i].ArbolGraph(listaInstrucciones[i]);
        }

        return resultado;
    }
}