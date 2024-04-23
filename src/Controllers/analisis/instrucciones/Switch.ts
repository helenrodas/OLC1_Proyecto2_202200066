import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";
import Case from "../instrucciones/Case";
import Default from "../instrucciones/Default";
import Contador from "../simbolo/Contador";
import Return from "./Return";
//import { listaErrores } from ".../indexController"

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


        for (let caso of this.listaCase) {
            let casoTemp = caso.condicion.interpretar(arbol,tabla)
            if (casoTemp instanceof Errores) return casoTemp
            if (casoTemp == condicion) {
                let resultado = caso.interpretar(arbol, tabla)
        
                if (resultado instanceof Return) return resultado;
        
                if (resultado instanceof Errores) return resultado
                if (resultado instanceof Break) return;
            
            }
        }

        if (this.casoDefault) {
            let resultado = this.casoDefault.interpretar(arbol, tabla);
            if (resultado instanceof Errores) return resultado
            
            if (resultado instanceof Return) return resultado;
            if (resultado instanceof Break) return;

        }
    }


    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let resultado = "";

        
        let contDefault: any = undefined;
        
        let contCase = [];
        let switchN = `n${contador.get()}`;
        
        let parIzq = `n${contador.get()}`;
        let exp = `n${contador.get()}`;
        
        let parDer = `n${contador.get()}`;
        let llav1 = `n${contador.get()}`;
        
        let padreCase = `n${contador.get()}`;

        if (this.listaCase != undefined) {
            for (let i = 0; i < this.listaCase.length; i++) {
            
                contCase.push(`n${contador.get()}`);
            }
        }

        if (this.casoDefault != undefined) {
            contDefault = `n${contador.get()}`;
        }

        resultado += `${switchN}[label="Switch"];\n`;
        resultado += `${parIzq}[label="("];\n`;
        resultado += `${exp}[label="Expresion"];\n`;
        resultado += `${parDer}[label=")"];\n`;
        resultado += `${llav1}[label="{"];\n`;
        resultado += `${padreCase}[label="cases_default"];\n`;

        if (this.listaCase != undefined) {
            for (let i = 0; i < this.listaCase.length; i++) {
                resultado += `${contCase[i]}[label="Case"];\n`;
            }
        }

        if (this.casoDefault != undefined) {
            resultado += `${contDefault}[label="Default"];\n`;
        }

        resultado += `${anterior} -> ${switchN};\n`;
        
        resultado += `${anterior} -> ${parIzq};\n`;
        
        resultado += `${anterior} -> ${exp};\n`;
        resultado += `${anterior} -> ${parDer};\n`;
        
        resultado += `${anterior} -> ${llav1};\n`;
        resultado += `${anterior} -> ${padreCase};\n`;

        if(this.listaCase != undefined){
            for (let i = 0; i < this.listaCase.length; i++) {
                resultado += `${padreCase} -> ${contCase[i]};\n`;
            }
        }

        if (this.casoDefault != undefined) {
            resultado += `${padreCase} -> ${contDefault};\n`;
        }

        resultado += this.condicion.ArbolGraph(exp);

        if(this.listaCase != undefined){
            for (let i = 0; i < this.listaCase.length; i++) {
                resultado += this.listaCase[i].ArbolGraph(contCase[i]);
            }
        }

        if(this.casoDefault != undefined){
            resultado += this.casoDefault.ArbolGraph(contDefault);
        }


        return resultado;
    }
}