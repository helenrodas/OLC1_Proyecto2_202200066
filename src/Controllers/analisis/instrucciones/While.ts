import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Contador from "../simbolo/Contador";
import Return from "./Return";

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
            arbol.Print("Error Semantico: La condicion debe ser bool. linea:"+ this.linea+" columna: " +(this.col+1));
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        while (this.condicion.interpretar(arbol, tabla)) {
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Sentencia While")
            for (let i of this.instrucciones) {
                if (i instanceof Break) return;
                if (i instanceof Continue) break;
                if (i instanceof Return) return i;
                let resultado = i.interpretar(arbol, newTabla)
                if (resultado instanceof Break) return;
                if (resultado instanceof Continue) break;
                if (resultado instanceof Errores) return resultado;
                
            }
        }
    }
    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let resultado = "";
        
        let listaInstrucciones = [];

        let padre = `n${contador.get()}`;
        let nWhile = `n${contador.get()}`;
        let par1 = `n${contador.get()}`;
        let cond = `n${contador.get()}`;
        let par2 = `n${contador.get()}`;
        let llav1 = `n${contador.get()}`;
        let padreIns = `n${contador.get()}`;

        for(let i = 0; i < this.instrucciones.length; i++){
            listaInstrucciones.push(`n${contador.get()}`);
        }

        let llav2 = `n${contador.get()}`;

        resultado += ` ${padre}[label="ciclo"];\n`;
        
        resultado += ` ${nWhile}[label="while"];\n`;
        
        resultado += ` ${par1}[label="("];\n`;
        resultado += ` ${cond}[label="Expresion"];\n`;
     
        resultado += ` ${par2}[label=")"];\n`;
        resultado += ` ${llav1}[label="{"];\n`;
        resultado += ` ${padreIns}[label="Instrucciones"];\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += ` ${listaInstrucciones[i]}[label="Instruccion"];\n`;
        }

        resultado += ` ${llav2}[label="}"];\n`;

        resultado += ` ${anterior} -> ${padre};\n`;
        resultado += ` ${padre} -> ${nWhile};\n`;
        
        resultado += ` ${padre} -> ${par1};\n`;
        
        resultado += ` ${padre} -> ${cond};\n`;
        resultado += ` ${padre} -> ${par2};\n`;
        
        resultado += ` ${padre} -> ${llav1};\n`;
        resultado += ` ${padre} -> ${padreIns};\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += ` ${padreIns} -> ${listaInstrucciones[i]};\n`;
        }

        resultado += ` ${padre} -> ${llav2};\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += this.instrucciones[i].ArbolGraph(listaInstrucciones[i]);
        }

        resultado += this.condicion.ArbolGraph(cond);
        

        return resultado;
    }
}