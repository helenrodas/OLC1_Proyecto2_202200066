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

        // Verificar si algun caso se cumple
        //let casoCumplido = false;

        for (let caso of this.listaCase) {
            let casoTemp = caso.condicion.interpretar(arbol,tabla)
            if (casoTemp instanceof Errores) return casoTemp
            if (casoTemp == condicion) {
                let resultado = caso.interpretar(arbol, tabla)
                if (resultado instanceof Break) return;
                //casoCumplido = true;
            
            }
        }

        // Si ningun caso se cumplio y hay un caso default, ejecutarlo
        if (this.casoDefault) {
           let resultado = this.casoDefault.interpretar(arbol, tabla);
           if (resultado instanceof Break) return;
        }
    }


    ArbolGraph(anterior: string): string {
        let reult = "";

        let contador = Contador.getInstancia();
        let contDefault: any = undefined;
        let contCase = [];
        let switchN = `n${contador.get()}`;
        let par1 = `n${contador.get()}`;
        let exp = `n${contador.get()}`;
        let par2 = `n${contador.get()}`;
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

        reult += `${switchN}[label="Switch"];\n`;
        reult += `${par1}[label="("];\n`;
        reult += `${exp}[label="Expresion"];\n`;
        reult += `${par2}[label=")"];\n`;
        reult += `${llav1}[label="{"];\n`;
        reult += `${padreCase}[label="cases_default"];\n`;

        if (this.listaCase != undefined) {
            for (let i = 0; i < this.listaCase.length; i++) {
                reult += `${contCase[i]}[label="Case"];\n`;
            }
        }

        if (this.casoDefault != undefined) {
            reult += `${contDefault}[label="Default"];\n`;
        }

        reult += `${anterior} -> ${switchN};\n`;
        reult += `${anterior} -> ${par1};\n`;
        reult += `${anterior} -> ${exp};\n`;
        reult += `${anterior} -> ${par2};\n`;
        reult += `${anterior} -> ${llav1};\n`;
        reult += `${anterior} -> ${padreCase};\n`;

        if(this.listaCase != undefined){
            for (let i = 0; i < this.listaCase.length; i++) {
                reult += `${padreCase} -> ${contCase[i]};\n`;
            }
        }

        if (this.casoDefault != undefined) {
            reult += `${padreCase} -> ${contDefault};\n`;
        }

        reult += this.condicion.ArbolGraph(exp);

        if(this.listaCase != undefined){
            for (let i = 0; i < this.listaCase.length; i++) {
                reult += this.listaCase[i].ArbolGraph(contCase[i]);
            }
        }

        if(this.casoDefault != undefined){
            reult += this.casoDefault.ArbolGraph(contDefault);
        }


        return reult;
    }
}