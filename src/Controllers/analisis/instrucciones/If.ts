import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Return from "./Return";
import Contador from "../simbolo/Contador";

export default class If extends Instruccion {
    private condicion: Instruccion
    private instruccionesif: Instruccion[]
    private instruccioneselse: Instruccion[]

    constructor(condicion: Instruccion, instrucciones1: Instruccion[],instrucciones2:Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.instruccionesif = instrucciones1
        this.instruccioneselse=instrucciones2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if (condicion instanceof Errores) return condicion

        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOLEAN) {
            arbol.Print("\n Error Semantico:"+"La condicion debe ser de tipo bool " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
            return new Errores("SEMANTICO", "La condicion debe ser de tipo bool", this.linea, this.col)
        }

        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("tabla IF")

        if (condicion) {
            for (let i of this.instruccionesif) {
                // if (i instanceof Break) return i;
                // if (i instanceof Return) return i;
                let resultado = i.interpretar(arbol, newTabla)
                if (resultado instanceof Break) return;
                if (resultado instanceof Return) return resultado;
            }
        }else{
            if(this.instruccioneselse){
                for (let i of this.instruccioneselse) {
                        if (i instanceof Break) return i;
                        if (i instanceof Continue) return i;
                        if (i instanceof Return) return i;
                        let resultado = i.interpretar(arbol, newTabla)
                        if (resultado instanceof Break) return; 
                        if (resultado instanceof Return) return resultado;
                    
                    }
            }
        }
    }

    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let result = "";

        let contInstruc = [];
        let contInstrucElse = [];
        let contInstrucElseIf = "";
        let llav1Else = "";
        let padreInstElse = "";
        let rElse = "";
        let llav2Else ="";
        let rElseIf = "";

        let rIf = `n${contador.get()}`;
        let par1 = `n${contador.get()}`;
        let cond = `n${contador.get()}`;
        let par2 = `n${contador.get()}`;
        let llav1 = `n${contador.get()}`;
        let padreInstIf = `n${contador.get()}`;

        for(let i = 0; i < this.instruccionesif.length; i++){
            contInstruc.push(`n${contador.get()}`);
        }

        let llav2 = `n${contador.get()}`;

        if(this.instruccioneselse != undefined){
            rElse = `n${contador.get()}`;
            llav1Else = `n${contador.get()}`;
            padreInstElse = `n${contador.get()}`;
            for(let i = 0; i < this.instruccioneselse.length; i++){
                contInstrucElse.push(`n${contador.get()}`);
            }
            llav2Else = `n${contador.get()}`;
        }

        if(this.condicion != undefined){
            contInstrucElseIf = `n${contador.get()}`;
            rElseIf = `n${contador.get()}`;
        }

        result += `${rIf}[label="If"];\n`;
        result += `${par1}[label="("];\n`;
        result += `${cond}[label="Expresion"];\n`;
        result += `${par2}[label=")"];\n`;
        result += `${llav1}[label="{"];\n`;
        result += `${padreInstIf}[label="Instrucciones"];\n`;

        for(let i = 0; i < contInstruc.length; i++){
            result += `${contInstruc[i]}[label="Instruccion"];\n`;
        }

        result += `${llav2}[label="}"];\n`;

        if(this.instruccioneselse != undefined){

            result += `${rElse}[label="Else"];\n`;
            result += `${llav1Else}[label="{"];\n`;
            result += `${padreInstElse}[label="Instrucciones"];\n`;

            for(let i = 0; i < contInstrucElse.length; i++){
                result += `${contInstrucElse[i]}[label="Instruccion"];\n`;
            }

            result += `${llav2Else}[label="}"];\n`;

        }

        if(this.condicion != undefined){
            result += `${contInstrucElseIf}[label="else If"];\n`;
        }

        result += `${anterior} -> ${rIf};\n`;
        result += `${anterior} -> ${par1};\n`;
        result += `${anterior} -> ${cond};\n`;
        result += `${anterior} -> ${par2};\n`;
        result += `${anterior} -> ${llav1};\n`;
        result += `${anterior} -> ${padreInstIf};\n`;

        for(let i = 0; i < contInstruc.length; i++){
            result += `${padreInstIf} -> ${contInstruc[i]};\n`;
        }

        if(this.instruccioneselse != undefined){
            result += `${anterior} -> ${rElse};\n`;
            result += `${anterior} -> ${llav1Else};\n`;
            result += `${anterior} -> ${padreInstElse};\n`;

            for(let i = 0; i < contInstrucElse.length; i++){
                result += `${padreInstElse} -> ${contInstrucElse[i]};\n`;
            }

            result += `${anterior} -> ${llav2Else};\n`;
        }

        if(this.condicion != undefined){
            result += `${anterior} -> ${contInstrucElseIf};\n`;
        }

        result += `${anterior} -> ${llav2};\n`;

        result += this.condicion.ArbolGraph(cond);

        for(let i = 0; i < contInstruc.length; i++){
            result += this.instruccionesif[i].ArbolGraph(contInstruc[i]);
        }

        if(this.instruccioneselse != undefined){
            for(let i = 0; i < contInstrucElse.length; i++){
                result += this.instruccioneselse[i].ArbolGraph(contInstrucElse[i]);
            }
        }

        if(this.condicion != undefined){
            result += this.condicion.ArbolGraph(contInstrucElseIf);
        }

        return result;

    }
}