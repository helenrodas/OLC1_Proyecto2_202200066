import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";


export default class IncreDecre extends Instruccion {
    private id: string;
    private instruc: boolean;

    constructor(id: string, linea: number, columna: number, instruc: boolean) {
        super(new Tipo(tipoDato.VOID), linea, columna);
        this.id = id;
        this.instruc = instruc;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //console.log("paso por aquiii")
        let valor = tabla.getVariable(this.id.toLocaleLowerCase());
        if (valor == null){
            arbol.Print("Error Semantico: No existe variable" + this.linea+" columna: " +(this.col+1));
            return new Errores("SEMANTICO", "No existe variable", this.linea, this.col)
        } 
        //console.log("el valor es:",valor.getTipo().getTipo());
        if (valor.getTipo().getTipo() != tipoDato.INTEGER){
            arbol.Print("Error Semantico: Variable invalida para operar" + this.linea+" columna: " +(this.col+1));
            return new Errores("SEMANTICO", "Variable invalida para operar", this.linea, this.col);
        } 
        if (this.instruc == true) {
            valor.setValor(parseInt(valor.getValor()) + 1);
        } else {
            valor.setValor(parseInt(valor.getValor()) - 1);
        }
    }

    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let result = "";

        let ident = `n${contador.get()}`;
        let nombre = `n${contador.get()}`;
        let mas1 = `n${contador.get()}`;
        let mas2 = `n${contador.get()}`;

        result += ` ${ident}[label="ID"];\n`;
        result += ` ${nombre}[label="${this.id}"];\n`;

        if(this.instruc == true){
            result += ` ${mas1}[label="+"];\n`;
            result += ` ${mas2}[label="+"];\n`;
        }else{
            result += ` ${mas1}[label="-"];\n`;
            result += ` ${mas2}[label="-"];\n`;
        }

        result += ` ${anterior} -> ${ident};\n`;
        result += ` ${ident} -> ${nombre};\n`;
        result += `${anterior} -> ${mas1};\n`;
        result += `${anterior} -> ${mas2};\n`;

        return result;
    }
}