import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Contador from "../simbolo/Contador";


export default class Declaracion extends Instruccion {
    private identificador: string[]
    private valor: Instruccion 

    constructor(tipo: Tipo, linea: number, col: number, id: string[], valor: Instruccion) {
        super(tipo, linea, col)
        this.identificador = id
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        
        let valorFinal = this.valor.interpretar(arbol, tabla)
        if (valorFinal instanceof Errores) return valorFinal
        console.log("entro al interpretar de declaracion: ")
        //console.log("este es valorFinal de declaracion: ",valorFinal)
        // console.log(this.tipoDato)
        // Verificacion de que los tipos de las variables declarados sean del mismo tipo del valor asignado
        if(this.valor.tipoDato.getTipo() == tipoDato.INTEGER && this.tipoDato.getTipo() == tipoDato.DOUBLE){
            //console.log("entro al if")
            this.identificador.forEach(id => {
                console.log(id)
                valorFinal = parseFloat(valorFinal);
                if (!tabla.setVariable(new Simbolo(this.tipoDato, id, valorFinal))){
                    return new Errores("Semantico", "No se puede declarar variable que ya existe", this.linea, this.col)
                }   
            });
        }
        else{
           // console.log("entro al else")
            if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()) {
                return new Errores("SEMANTICO", "No se puede declarar variable", this.linea, this.col)
            }
            
            this.identificador.forEach(elemento => {
                // console.log("despues del else")
                // console.log(elemento)
                if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
                    return new Errores("SEMANTICO", "variable ya existe!", this.linea, this.col)
                }   
            })
            
        }
        
    }

    ArbolGraph(anterior: string): string {
        let result = "";
        let contador = Contador.getInstancia();

        let declar = `n${contador.get()}`;

        let tipoD = `n${contador.get()}`;
        let ids = `n${contador.get()}`;

        let conjuntoID = [];
        for(let i= 0; i < this.identificador.length; i++){
            conjuntoID.push(`n${contador.get()}`);

        }
        let igual = `n${contador.get()}`;
        let valor = `n${contador.get()}`;
        let puntocoma = `n${contador.get()}`;

        result += `${declar}[label="Declaracion"];\n`
        if(this.tipoDato.getTipo() == tipoDato.INTEGER){
            result += `${tipoD}[label="int"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.DOUBLE){
            result += `${tipoD}[label="double"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.BOOLEAN){
            result += `${tipoD}[label="bool"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.STRING){
            result += `${tipoD}[label="std::string"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.CHAR){
            result += `${tipoD}[label="char"];\n`
        }

        result += `${ids}[label="IDS"];\n`

        for(let i= 0; i < this.identificador.length; i++){
            result += `${conjuntoID[i]} [label = "${this.identificador[i]}"];\n`
        }

        result += `${igual}[label="="];\n`
        result += `${valor}[label="Expresion"];\n`
        result += `${puntocoma}[label=";"];\n`

        result += `${anterior} -> ${declar};\n`
        result += `${declar} -> ${ids};\n`
        result += `${declar} -> ${tipoD};\n`
        
        for(let i= 0; i < this.identificador.length; i++){
            result += `${ids} -> ${conjuntoID[i]};\n`
        }

        result += `${declar} -> ${igual};\n`
        result += `${declar} -> ${valor};\n`
        result += `${declar} -> ${puntocoma};\n`

        this.valor.ArbolGraph(valor);

        return result;
    }


}