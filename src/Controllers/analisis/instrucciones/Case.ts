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
        let result = "";

        let caseN = `n${contador.get()}`;
        let cond = `n${contador.get()}`;
        let dospuntos = `n${contador.get()}`;
        let padreInstrucciones = `n${contador.get()}`;
        let contInstrucciones = [];

        for (let i = 0; i < this.instrucciones.length; i++) {
            contInstrucciones.push(`n${contador.get()}`);
        }

        result += `${caseN}[label="case"];\n`;
        result += `${cond}[label="Expresion"];\n`;
        result += `${dospuntos}[label=":"];\n`;
        result += `${padreInstrucciones}[label="Instrucciones"];\n`;

        for (let i = 0; i < this.instrucciones.length; i++) {
            result += `${contInstrucciones[i]}[label="Instruccion"];\n`;
        }

        result += `${anterior} -> ${caseN};\n`;
        result += `${anterior} -> ${cond};\n`;
        result += `${anterior} -> ${dospuntos};\n`;
        result += `${anterior} -> ${padreInstrucciones};\n`;

        for (let i = 0; i < this.instrucciones.length; i++) {
            result += `${padreInstrucciones} -> ${contInstrucciones[i]};\n`;
        }

        result += this.condicion.ArbolGraph(cond);

        for (let i = 0; i < this.instrucciones.length; i++) {
            result += this.instrucciones[i].ArbolGraph(contInstrucciones[i]);
        }

        return result;

    }
}