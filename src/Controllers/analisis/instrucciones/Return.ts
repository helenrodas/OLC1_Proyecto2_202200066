import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
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

// export default class Return extends Instruccion {
//     public exp?: Instruccion
//     public expresion = null

//     constructor(linea: number, columna: number, exp?: Instruccion) {
//         super(new Tipo(tipoDato.VOID), linea, columna)
//         this.exp = exp
//     }

//     interpretar(arbol: Arbol, tabla: tablaSimbolo) {
//         console.log("entro al return")
//         if(this.exp) {
//             console.log("esto es la expresion enviada: ",this.exp)
//             console.log("entro al interpretar de return")
//             let valorExpre = this.exp.interpretar(arbol, tabla)
//             console.log("valor interprretado de return: ",valorExpre)
//             this.expresion = valorExpre
//             if(valorExpre instanceof Errores) return valorExpre
//             this.tipoDato.setTipo(this.exp.tipoDato.getTipo())
//         }
//         return this
//     }
// }