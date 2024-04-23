import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Contador from "../simbolo/Contador";

export default class Case extends Instruccion {
    public condicion: Instruccion
    public instrucciones: Instruccion[]

    constructor(condicion: Instruccion, instrucciones: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if (condicion instanceof Errores) return condicion


        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("tabla Case")

            for (let i of this.instrucciones) {
                if (i instanceof Break) return i;
                let resultado = i.interpretar(arbol, newTabla)
                if (resultado instanceof Break) return resultado;
                if (resultado instanceof Errores) return resultado;
           }
    }
    

    
    ArbolGraph(anterior: string): string {
        
        let contador = Contador.getInstancia();
        let resultado = "";

        let Caso = `n${contador.get()}`;
      
        let condicional = `n${contador.get()}`;
     
     
        let dospuntos = `n${contador.get()}`;
        let Instruccion = `n${contador.get()}`;
        let listaInstrucciones = [];

        for (let i = 0; i < this.instrucciones.length; i++) {
            listaInstrucciones.push(`n${contador.get()}`);
        }

        resultado += `${Caso}[label="case"];\n`;
       
       
        resultado += `${condicional}[label="Expresion"];\n`;
     
        resultado += `${dospuntos}[label=":"];\n`;
        resultado += `${Instruccion}[label="Instrucciones"];\n`;

        for (let i = 0; i < this.instrucciones.length; i++) {
            resultado += `${listaInstrucciones[i]}[label="Instruccion"];\n`;
        }

        resultado += `${anterior} -> ${Caso};\n`;
       
        resultado += `${anterior} -> ${condicional};\n`;
        
        resultado += `${anterior} -> ${dospuntos};\n`;
        resultado += `${anterior} -> ${Instruccion};\n`;

        for (let i = 0; i < this.instrucciones.length; i++) {
            resultado += `${Instruccion} -> ${listaInstrucciones[i]};\n`;
        }

        resultado += this.condicion.ArbolGraph(condicional);

        for (let i = 0; i < this.instrucciones.length; i++) {
        
            resultado += this.instrucciones[i].ArbolGraph(listaInstrucciones[i]);
        }

        return resultado;

    }
}