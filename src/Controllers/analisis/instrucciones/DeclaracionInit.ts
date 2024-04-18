import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class DeclaracionInit extends Instruccion{

    private identificador: string []
    
    constructor(tipo: Tipo, linea: number, columna: number, id: string []){
        super(tipo, linea, columna)
        this.identificador = id
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        
        let valorFinal: any;
       
        this.identificador.forEach(elemento => {

            switch(this.tipoDato.getTipo()){
                case tipoDato.INTEGER:
                    valorFinal = 0;
                    break;
                case tipoDato.STRING:
                    valorFinal = "";
                    break;
                case tipoDato.BOOLEAN:
                    valorFinal = true;
                    break;
                case tipoDato.CHAR:
                    valorFinal = '0';
                    break;
                case tipoDato.DOUBLE:
                    valorFinal = 0.0;
                    break;
                default:
                    arbol.Print("\n Error Semantico:"+"No es posible declarar variable " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
                    return new Errores("Error semántico", "No es posible declarar variable.", this.linea, this.col);
                
            }
    
            if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
                arbol.Print("\n Error Semantico:"+"La variable ya esta declarada " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
                return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
            }   
        });

    }

}