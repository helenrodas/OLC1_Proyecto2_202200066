import { Instruccion } from "../abstracto/Instruccion";

import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Contador from "../simbolo/Contador";
import { listaErrores } from "../../indexController";


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
                //console.log(id)
                valorFinal = parseFloat(valorFinal);
                if (!tabla.setVariable(new Simbolo(this.tipoDato, id, valorFinal))){
                    arbol.Print("Error Semantico: No se puede declarar variable que ya existe:"+ this.linea+" columna: " +(this.col+1));
                    
                    let error = new Errores("Semantico", "No se puede declarar variable que ya existe", this.linea, this.col)
                    listaErrores.push(error)
                    return error
                }   
            });
        }
        else{
           // console.log("entro al else")
            if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()) {
                arbol.Print("Error Semantico: Variable no es del tipo esperado:"+ this.linea+" columna: " +(this.col+1));
                //let error = new Errores("SEMANTICO", "Variable no es del tipo esperado", this.linea, this.col)
                //listaErrores.push(error)
                return new Errores("SEMANTICO", "Variable no es del tipo esperado", this.linea, this.col)
            }
            
            this.identificador.forEach(elemento => {

                if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
                    arbol.Print("Error Semantico: variable ya existe!:"+ this.linea+" columna: " +(this.col+1));
                    let error = new Errores("SEMANTICO", "variable ya existe!", this.linea, this.col)
                    listaErrores.push(error)
                    return error
                }   
            })
            
        }
        
    }

    ArbolGraph(anterior: string): string {
        
        let indice = Contador.getInstancia();

        let declaracion = `n${indice.get()}`;
        let resultado = "";


        let datoActual = `n${indice.get()}`;
        let identificadores = `n${indice.get()}`;

        let listaId = [];
        for(let i= 0; i < this.identificador.length; i++){
            listaId.push(`n${indice.get()}`);

        }
        let igual = `n${indice.get()}`;


        let puntocoma = `n${indice.get()}`;
        let valor = `n${indice.get()}`;

        resultado += `${declaracion}[label="Declaracion"];\n`
        if(this.tipoDato.getTipo() == tipoDato.INTEGER){
            resultado += `${datoActual}[label="int"];\n`

        }else if(this.tipoDato.getTipo() == tipoDato.DOUBLE){
            resultado += `${datoActual}[label="double"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.BOOLEAN){
            resultado += `${datoActual}[label="bool"];\n`

        }else if(this.tipoDato.getTipo() == tipoDato.STRING){
            resultado += `${datoActual}[label="std::string"];\n`


        }else if(this.tipoDato.getTipo() == tipoDato.CHAR){
            resultado += `${datoActual}[label="char"];\n`
        }

        resultado += `${identificadores}[label="IDS"];\n`

        for(let i= 0; i < this.identificador.length; i++){


            resultado += `${listaId[i]} [label = "${this.identificador[i]}"];\n`
        }

        resultado += `${igual}[label="="];\n`


        resultado += `${valor}[label="Expresion"];\n`

        resultado += `${puntocoma}[label=";"];\n`

        resultado += `${anterior} -> ${declaracion};\n`
        resultado += `${declaracion} -> ${identificadores};\n`


        resultado += `${declaracion} -> ${datoActual};\n`
        
        for(let i= 0; i < this.identificador.length; i++){
            resultado += `${identificadores} -> ${listaId[i]};\n`
        }

        resultado += `${declaracion} -> ${igual};\n`

        resultado += `${declaracion} -> ${valor};\n`



        resultado += `${declaracion} -> ${puntocoma};\n`

        this.valor.ArbolGraph(valor);

        return resultado;
    }

}