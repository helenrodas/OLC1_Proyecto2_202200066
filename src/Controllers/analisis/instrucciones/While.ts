import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Contador from "../simbolo/Contador";

/*
while(exp){
    instrucciones
}
*/
export default class While extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion[]

    constructor(cond: Instruccion, ins: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = cond
        this.instrucciones = ins
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let cond = this.condicion.interpretar(arbol, tabla)
        if (cond instanceof Errores) return cond

        // validaciones
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOLEAN) {
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        while (this.condicion.interpretar(arbol, tabla)) {
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Sentencia While")
            for (let i of this.instrucciones) {
                if (i instanceof Break) return;
                if (i instanceof Continue) break;
                let resultado = i.interpretar(arbol, newTabla)
                if (resultado instanceof Break) return;
                if (i instanceof Continue) break;
                // falta validacion de errors
            }
        }
    }
    ArbolGraph(anterior: string): string {
        let result = "";
        let contador = Contador.getInstancia();
        let contInstruc = [];

        let padre = `n${contador.get()}`;
        let nWhile = `n${contador.get()}`;
        let par1 = `n${contador.get()}`;
        let cond = `n${contador.get()}`;
        let par2 = `n${contador.get()}`;
        let llav1 = `n${contador.get()}`;
        let padreIns = `n${contador.get()}`;

        for(let i = 0; i < this.instrucciones.length; i++){
            contInstruc.push(`n${contador.get()}`);
        }

        let llav2 = `n${contador.get()}`;

        result += ` ${padre}[label="ciclo"];\n`;
        result += ` ${nWhile}[label="while"];\n`;
        result += ` ${par1}[label="("];\n`;
        result += ` ${cond}[label="Expresion"];\n`;
        result += ` ${par2}[label=")"];\n`;
        result += ` ${llav1}[label="{"];\n`;
        result += ` ${padreIns}[label="Instrucciones"];\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            result += ` ${contInstruc[i]}[label="Instruccion"];\n`;
        }

        result += ` ${llav2}[label="}"];\n`;

        result += ` ${anterior} -> ${padre};\n`;
        result += ` ${padre} -> ${nWhile};\n`;
        result += ` ${padre} -> ${par1};\n`;
        result += ` ${padre} -> ${cond};\n`;
        result += ` ${padre} -> ${par2};\n`;
        result += ` ${padre} -> ${llav1};\n`;
        result += ` ${padre} -> ${padreIns};\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            result += ` ${padreIns} -> ${contInstruc[i]};\n`;
        }

        result += ` ${padre} -> ${llav2};\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            result += this.instrucciones[i].ArbolGraph(contInstruc[i]);
        }

        result += this.condicion.ArbolGraph(cond);
        

        return result;
    }
}