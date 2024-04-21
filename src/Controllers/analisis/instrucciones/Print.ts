import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import { BreadcrumbItem } from "react-bootstrap";
import Contador from "../simbolo/Contador";

export default class Print extends Instruccion {
    private expresion: Instruccion
    private bandera: boolean

    constructor(exp: Instruccion,bandera:boolean ,linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.expresion = exp
        this.bandera = bandera
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor = this.expresion.interpretar(arbol, tabla)
        console.log(valor)
        if (valor instanceof Errores) return valor
        if(this.bandera == true){
            arbol.Print(valor + "\n")
        }else{
            arbol.Print(valor)
        }
        
    }

    ArbolGraph(anterior: string): string {
        let result = "";

        let contador = Contador.getInstancia();
        let cout = `n${contador.get()}`;
        let dobleSigno = `n${contador.get()}`;
        let nodoExpresion = `n${contador.get()}`;
        let dobleSignoRepetido = `n${contador.get()}`;
        let signoEndl = `n${contador.get()}`;
        let puntoComa = `n${contador.get()}`;
        
        result += `${cout}[label="cout"];\n`;
        result += `${dobleSigno}[label="<<"];\n`;
        result += `${nodoExpresion}[label="Expresion"];\n`;
        result += `${puntoComa}[label=";"];\n`;

        if(this.bandera == true){
            result += `${cout}[label="cout"];\n`;
            result += `${dobleSigno}[label="<<"];\n`;
            result += `${nodoExpresion}[label="Expresion"];\n`;
            result += `${dobleSignoRepetido}[label="<<"];\n`;
            result += `${signoEndl}[label="endl"];\n`;
            result += `${puntoComa}[label=";"];\n`;

            result += `${anterior} -> ${cout};\n`;
            result += `${anterior} -> ${dobleSigno};\n`;
            result += `${anterior} -> ${nodoExpresion};\n`;
            result += `${anterior} -> ${dobleSignoRepetido};\n`;
            result += `${anterior} -> ${signoEndl};\n`;
            result += `${anterior} -> ${puntoComa};\n`;
            result += this.expresion.ArbolGraph(nodoExpresion);
        
        }else{
            result += `${cout}[label="cout"];\n`;
            result += `${dobleSigno}[label="<<"];\n`;
            result += `${nodoExpresion}[label="Expresion"];\n`;
            result += `${puntoComa}[label=";"];\n`;

            result += `${anterior} -> ${cout};\n`;
            result += `${anterior} -> ${dobleSigno};\n`;
            result += `${anterior} -> ${nodoExpresion};\n`;
            result += `${anterior} -> ${puntoComa};\n`;
            result += this.expresion.ArbolGraph(nodoExpresion);
        }


        return result;
    }
}