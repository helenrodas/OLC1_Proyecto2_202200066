import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Contador from "../simbolo/Contador";

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
    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let resultado = "";

        let Sent_default = `n${contador.get()}`;

        let dospuntos = `n${contador.get()}`;
        
        let instrucciones = `n${contador.get()}`;
        
        
        let listaInstrucciones = [];

        for(let i = 0; i < this.instrucciones.length; i++){
            listaInstrucciones.push(`n${contador.get()}`);
        }

        resultado += `${Sent_default}[label="Default"];\n`;
        resultado += `${dospuntos}[label=":"];\n`;
        resultado += `${instrucciones}[label="Instrucciones"];\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += `${listaInstrucciones[i]}[label="Instruccion"];\n`;
        }

        resultado += `${anterior} -> ${Sent_default};\n`;
        resultado += `${anterior} -> ${dospuntos};\n`;
        resultado += `${anterior} -> ${instrucciones};\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += `${instrucciones} -> ${listaInstrucciones[i]};\n`;
        }

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += this.instrucciones[i].ArbolGraph(listaInstrucciones[i]);
        }

        return resultado;
    }
}