import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import { BreadcrumbItem } from "react-bootstrap";
import Contador from "../simbolo/Contador";

export default class Print extends Instruccion {
    private expresion: Instruccion
    private indicador: boolean

    constructor(exp: Instruccion,indicador:boolean ,linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.expresion = exp
        this.indicador = indicador
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor = this.expresion.interpretar(arbol, tabla)
        console.log(valor)
        if (valor instanceof Errores) return valor
        if(this.indicador == true){
            arbol.Print(valor + "\n")
        }else{
            arbol.Print(valor)
        }
        
    }

    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let resultado = "";

        
        let imprimir = `n${contador.get()}`;
        let signoImpr = `n${contador.get()}`;

        let nodoExpresion = `n${contador.get()}`;
        let signoImpr2 = `n${contador.get()}`;


        let signoEndl = `n${contador.get()}`;
        let puntoComa = `n${contador.get()}`;
        
        resultado += `${imprimir}[label="imprimir"];\n`;
        
        resultado += `${signoImpr}[label="<<"];\n`;
        
        resultado += `${nodoExpresion}[label="Expresion"];\n`;
        resultado += `${puntoComa}[label=";"];\n`;

        if(this.indicador == true){
            resultado += `${imprimir}[label="imprimir"];\n`;
            
            resultado += `${signoImpr}[label="<<"];\n`;
            resultado += `${nodoExpresion}[label="Expresion"];\n`;
            resultado += `${signoImpr2}[label="<<"];\n`;
            
            
            resultado += `${signoEndl}[label="endl"];\n`;
            resultado += `${puntoComa}[label=";"];\n`;

            resultado += `${anterior} -> ${imprimir};\n`;
        
            resultado += `${anterior} -> ${signoImpr};\n`;
            resultado += `${anterior} -> ${nodoExpresion};\n`;
        
            resultado += `${anterior} -> ${signoImpr2};\n`;
            resultado += `${anterior} -> ${signoEndl};\n`;
            resultado += `${anterior} -> ${puntoComa};\n`;
            resultado += this.expresion.ArbolGraph(nodoExpresion);
        
        }else{
            resultado += `${imprimir}[label="imprimir"];\n`;
            resultado += `${signoImpr}[label="<<"];\n`;
            resultado += `${nodoExpresion}[label="Expresion"];\n`;
            resultado += `${puntoComa}[label=";"];\n`;

            resultado += `${anterior} -> ${imprimir};\n`;
            resultado += `${anterior} -> ${signoImpr};\n`;
        
            resultado += `${anterior} -> ${nodoExpresion};\n`;
            resultado += `${anterior} -> ${puntoComa};\n`;
            resultado += this.expresion.ArbolGraph(nodoExpresion);
        }


        return resultado;
    }
}