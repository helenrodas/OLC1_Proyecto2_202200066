import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Return from "./Return";
import Contador from "../simbolo/Contador";
import Simbolo from "../simbolo/Simbolo";



export default class ArrayD extends Instruccion{
    private index1:Tipo;
    private index2?:Tipo |undefined;
    private id:string;
    private PrimeraPos?:Instruccion |undefined;
    private SegundaPos?:Instruccion |undefined;
    private instrucciones?: Instruccion[][] | undefined;
    

    constructor(index1:Tipo,id:string,linea:number,colum:number,index2?:Tipo | undefined,PrimeraPos?:Instruccion,
        SegundaPos?:Instruccion,instrucciones?: Instruccion[][]){
            super(index1, linea, colum)
            this.id = id
            this.index1 =index1
            this.index2 = index2
            this.PrimeraPos = PrimeraPos
            this.SegundaPos = SegundaPos
            this.instrucciones = instrucciones
            
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let ArrayD: any[][] = []


        if(this.instrucciones){
            let ArrayDos =  new Array(this.instrucciones.length)

            for(let i=0; i<this.instrucciones.length;i++){

                if(Array.isArray(this.instrucciones[i])){
                    ArrayDos[i] = new Array(this.instrucciones[i].length)

                    for(let j=0; j< this.instrucciones.length;j++){
                        let dato = this.instrucciones[i][j].interpretar(arbol,tabla)
                        if(dato instanceof Errores) return dato
                        if(this.index1.getTipo() != this.instrucciones[i][j].tipoDato.getTipo()){
                            arbol.Print("Error Semantico:"+"Dimensiones no validas" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                            return new Errores("SEMANTICO", "Dimensiones no validas", this.linea, this.col);
                        }
                        ArrayDos[i][j] = dato
                    }

                }else{
                    arbol.Print("Error Semantico:"+"Se esperaba un vector" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                    return new Errores("SEMANTICO", "Se esperaba un vector", this.linea, this.col);

                }
                

            }
            if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, ArrayDos))){
                arbol.Print("--> Error Semantico:"+"Variable ya existe previamente" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                return new Errores("SEMANTICO", "Variable ya existe previamente", this.linea, this.col)
            }
                

        }else {
            
            if (this.PrimeraPos && this.SegundaPos) {
                const dim1 = this.PrimeraPos.interpretar(arbol, tabla);
                const dim2 = this.SegundaPos.interpretar(arbol, tabla);
                if(dim1 instanceof Errores) return dim1
                if(dim2 instanceof Errores) return dim2


                if (this.PrimeraPos.tipoDato.getTipo() !=  tipoDato.INTEGER && this.SegundaPos.tipoDato.getTipo() !=  tipoDato.INTEGER) {
                    arbol.Print("Error Semantico:"+"Dimensiones no validas" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                    return new Errores("SEMANTICO", "Dimensiones no validas", this.linea, this.col);
                }

                if (dim1 <= 0 || dim2 <= 0) {
                    return new Errores("SEMANTICO", "Las dimensiones deben ser positivas", this.linea, this.col);
                }

                
                for (let i = 0; i < dim1; i++) {
                    let fila: any[] = [];
                    for (let j = 0; j < dim2; j++) {
                        fila.push(null);
                    }
                    ArrayD.push(fila);
                }
            } else {
                arbol.Print("Error Semantico:"+"Posiciones del arreglo no estan definidas" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                return new Errores("SEMANTICO", "Posiciones del arreglo no estan definidas", this.linea, this.col);
            }


        if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, ArrayD))){
            arbol.Print("Error Semantico:"+"Variable ya existe previamente" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Variable ya existe previamente", this.linea, this.col)
        }

        return null;
        }

    }


    ArbolGraph(anterior: string): string {
        return ''
    }
}