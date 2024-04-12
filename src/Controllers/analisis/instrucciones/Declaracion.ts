import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

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

        // Verificacion de que los tipos de las variables declarados sean del mismo tipo del valor asignado
        // if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()) {
        //     return new Errores("SEMANTICO", "No se puede declarar variable", this.linea, this.col)
        // }
        this.identificador.forEach(elemento => {
            if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
                return new Errores("SEMANTICO", "variable ya existe!", this.linea, this.col)
            }   
        })
    }

}