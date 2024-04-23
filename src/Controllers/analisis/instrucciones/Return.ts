import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";


export default class Return extends Instruccion{

    public expresion: Instruccion | undefined;

    constructor(linea:number, columna:number,expresion?: Instruccion){
        super(new Tipo(tipoDato.VOID), linea, columna);
        this.expresion = expresion;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if(this.expresion != undefined){
            let result = this.expresion.interpretar(arbol, tabla);
            //console.log("este es result:",result)
            if(result instanceof Errores) return result;
            this.tipoDato = this.expresion.tipoDato
        }
        return this;
    }

    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let result = "";

        let returnn = `n${contador.get()}`;
        let exp = `n${contador.get()}`;

        let puntocoma = `n${contador.get()}`;

        result += `${returnn}[label="Return"];\n`;
        if(this.expresion != undefined){
            result += `${exp}[label="Expresion"];\n`;
        }

        result += `${puntocoma}[label=";"];\n`;

        result += `${anterior} -> ${returnn};\n`;
        if(this.expresion != undefined){
            result += `${anterior} -> ${exp};\n`;
        }

        result += `${anterior} -> ${puntocoma};\n`;

        if(this.expresion != undefined){
            result += this.expresion.ArbolGraph(exp);
        }
        

        return result;
    }
}