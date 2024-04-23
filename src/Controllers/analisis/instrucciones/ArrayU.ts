import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class ArrayU extends Instruccion{
    private tipoPrincipal:Tipo;
    private tipoNew?:Tipo |undefined;
    private id:string;
    private size?:Instruccion |undefined;
    private listaDatos?: Instruccion[] | undefined;
    
    
    constructor(tipoPrincipal:Tipo,id:string,linea:number,colum:number,tipoNew?:Tipo |undefined,size?:Instruccion |undefined,listaDatos?:any[] |undefined){
        super(tipoPrincipal, linea, colum)
        this.tipoPrincipal = tipoPrincipal
        this.tipoNew = tipoNew
        this.id = id
        this.size = size
        this.listaDatos = listaDatos
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        if(this.size){
            if(this.tipoPrincipal.getTipo() != this.tipoNew?.getTipo()){
                arbol.Print("\n Error Semantico:"+"Tipos de datos en declaracion de arreglo son diferentes " + "linea: " + this.linea + " columna: " + (this.col+1) + "\n")
                return new Errores("SEMANTICA", "Tipos de datos son diferentes ", this.linea, this.col);
            }
            
            let tamanio = this.size.interpretar(arbol,tabla)
            if(tamanio instanceof Errores) return tamanio
            if(this.size.tipoDato.getTipo() !=  tipoDato.INTEGER) return new Errores("SEMANTICA", "Dato no es entero", this.linea, this.col);
            let arry: any = [];
            for(let i=0;i < tamanio ;i++){
                arry[i] = []
            }
            if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, arry))){
                arbol.Print("\n Error Semantico:"+"Variable ya existe " + " linea: " + this.linea + "columna: " + (this.col+1) + "\n")
                return new Errores("SEMANTICO", "Variable ya existe", this.linea, this.col)
            }


        }
        else if(this.listaDatos){
            let arry: any= []

            for(let i =0; i < this.listaDatos.length;i++){
                let dato = this.listaDatos[i].interpretar(arbol,tabla)

                if(dato instanceof Errores) return dato
                if(this.tipoPrincipal.getTipo() != this.listaDatos[i].tipoDato.getTipo()){
                    arbol.Print("\n Error Semantico:"+"Tipo de dato en arreglo es invalido " + " linea: " + this.linea + " columna: " + (this.col+1)+ "\n")
                    return new Errores("SEMANTICA", "Tipo de dato en declaracion invalido", this.linea, this.col);
                }
                arry[i] = dato
            }
            
            if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, arry))){
                arbol.Print("\n Error Semantico:"+"Variable ya existe " + " linea: " + this.linea + "columna: " + (this.col+1) + "\n")
                return new Errores("SEMANTICO", "Variable ya existe", this.linea, this.col)
            }
        } 
    }

    ArbolGraph(anterior: string): string {
        return "";
    }
}