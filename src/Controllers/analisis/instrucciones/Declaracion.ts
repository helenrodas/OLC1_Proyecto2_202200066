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
                    arbol.Print("Error Semantico: No se puede declarar variable que ya existe:"+ this.linea+" columna: " +(this.col+1));
                    return new Errores("Semantico", "No se puede declarar variable que ya existe", this.linea, this.col)
                }   
            });
        }
        else{
           // console.log("entro al else")
            if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()) {
                arbol.Print("Error Semantico: No se puede declarar variable que ya existe:"+ this.linea+" columna: " +(this.col+1));
                return new Errores("SEMANTICO", "No se puede declarar variable", this.linea, this.col)
            }
            
            this.identificador.forEach(elemento => {

                if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
                    arbol.Print("Error Semantico: No se puede declarar variable que ya existe:"+ this.linea+" columna: " +(this.col+1));
                    return new Errores("SEMANTICO", "variable ya existe!", this.linea, this.col)
                }   
            })
            
        }
        
    }

    ArbolGraph(anterior: string): string {
        let result = "";
        let indice = Contador.getInstancia();

        let declaracion = `n${indice.get()}`;

        let tipoD = `n${indice.get()}`;
        let identificadores = `n${indice.get()}`;

        let arregloIdentificadores = [];
        for(let i= 0; i < this.identificador.length; i++){
            arregloIdentificadores.push(`n${indice.get()}`);

        }
        let igual = `n${indice.get()}`;
        let valor = `n${indice.get()}`;
        let puntocoma = `n${indice.get()}`;

        result += `${declaracion}[label="Declaracion"];\n`
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

        result += `${identificadores}[label="IDS"];\n`

        for(let i= 0; i < this.identificador.length; i++){
            result += `${arregloIdentificadores[i]} [label = "${this.identificador[i]}"];\n`
        }

        result += `${igual}[label="="];\n`
        result += `${valor}[label="Expresion"];\n`
        result += `${puntocoma}[label=";"];\n`

        result += `${anterior} -> ${declaracion};\n`
        result += `${declaracion} -> ${identificadores};\n`
        result += `${declaracion} -> ${tipoD};\n`
        
        for(let i= 0; i < this.identificador.length; i++){
            result += `${identificadores} -> ${arregloIdentificadores[i]};\n`
        }

        result += `${declaracion} -> ${igual};\n`
        result += `${declaracion} -> ${valor};\n`
        result += `${declaracion} -> ${puntocoma};\n`

        this.valor.ArbolGraph(valor);

        return result;
    }


}