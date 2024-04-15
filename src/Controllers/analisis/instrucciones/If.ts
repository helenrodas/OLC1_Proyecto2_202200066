import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Continue from "./continue";


export default class If extends Instruccion {
    private condicion1: Instruccion
    private condicion2: If | undefined
    private instrucciones1: Instruccion[]
    private instrucciones2: Instruccion  []| undefined
    private operacion: Operadores

    constructor(operador: Operadores, condicional1: Instruccion, instrucciones1: Instruccion[], linea: number, col: number,instrucciones2?:Instruccion[],condicional2?:If) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.operacion = operador
        this.condicion2 = condicional2
        this.condicion1 = condicional1
        this.instrucciones1 = instrucciones1
        this.instrucciones2 = instrucciones2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicional1 = this.condicion1.interpretar(arbol, tabla)
        if (condicional1 instanceof Errores) return condicional1

        let condicional2 = this.condicion1.interpretar(arbol, tabla)
        if (condicional2 instanceof Errores) return condicional2


        switch(this.operacion){
            case Operadores.SENT_IF:
                console.log("entro a funcion if")
                return this.funcionIf(condicional1,arbol,tabla)
            case Operadores.SENT_ELSE:
                console.log("entro a funcion else")
                return this.funcionElse(condicional1,arbol,tabla)
            case Operadores.SENT_ELSEIF:
                console.log("entro a funcion if else if")
                return this.funcionElseIf(condicional1,condicional2,arbol,tabla)
        }

    }

    funcionIf(condicional1:any,arbol:Arbol ,tabla:tablaSimbolo){
        // validacion
        if (this.condicion1.tipoDato.getTipo() != tipoDato.BOOLEAN) {
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("Instruccion IF")

        if (condicional1) {
            for (let i of this.instrucciones1) {
                if (i instanceof Break) return i;
                if (i instanceof Continue) return i;
                let resultado = i.interpretar(arbol, newTabla)
                // falta validar errores para cuando vengan errores en i
            }
        }
    }

    funcionElse(condicional1:any,arbol:Arbol ,tabla:tablaSimbolo){
        // validacion
        if (this.condicion1.tipoDato.getTipo() != tipoDato.BOOLEAN) {
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("Instruccion IF")

        if (condicional1) {
            for (let i of this.instrucciones1) {
                if (i instanceof Break) return i;
                if (i instanceof Continue) return i;
                let resultado = i.interpretar(arbol, newTabla)
                // falta validar errores para cuando vengan errores en i
            }
        }else{
            if(this.instrucciones2){
                let newTablaElse = new tablaSimbolo(tabla)
                newTablaElse.setNombre("Instruccion ELSE")
                for (let i of this.instrucciones2) {
                    if (i instanceof Break) return i;
                    if (i instanceof Continue) return i;
                    let resultado = i.interpretar(arbol, newTablaElse)
                    // falta validar errores para cuando vengan errores en i
                }
            }
            
        }
    }
    funcionElseIf(condicional1: any, condicional2: any, arbol: Arbol, tabla: tablaSimbolo): any {

        // console.log(condicional1)
        // if(this.condicion2){
        //     console.log(this.condicion2)
        // }
        let elseIfMatched = false;
        
       

        if(condicional1){
            console.log("entro al if...no deberiua")
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Instruccion IF")
            for (let i of this.instrucciones1) {
                if (i instanceof Break) return i;
                if (i instanceof Continue) return i;
                let resultado = i.interpretar(arbol, newTabla)
                // falta validar errores para cuando vengan errores en i
            }
        }else if(this.condicion2){
            let currentElseIf: If | undefined = this.condicion2; 
            
            while (currentElseIf) {
                if (currentElseIf.condicion1) {
                    console.log("entro al else if...si debe");
                    let dato = currentElseIf.condicion1.interpretar(arbol, tabla);
                    console.log(dato);
                    if (dato) {
                        elseIfMatched = true;
                        console.log("cambio bandera a true")
                        if (currentElseIf.instrucciones1) {
                            let newTabla = new tablaSimbolo(tabla);
                            newTabla.setNombre("Instruccion con2 ins1");
                            for (let i of currentElseIf.instrucciones1) {
                                if (i instanceof Break) return i;
                                if (i instanceof Continue) return i;
                                let resultado = i.interpretar(arbol, newTabla);
                                // falta validar errores para cuando vengan errores en i
                            }
                        }
                        return; // Terminamos la ejecución si se cumple una condición else if
                    }
                }
                // Pasamos a la siguiente condición else if
                currentElseIf = currentElseIf.condicion2;
            }
            if (!elseIfMatched) { // Solo si ninguna condición else if se cumplió
                console.log("entro al else del while")
               return this.funcionElse("",arbol,tabla)
            }
            

            
        }else{
            console.log("entro al else!!")
            if (!elseIfMatched && this.instrucciones2) { // Solo si ninguna condición else if se cumplió

                let newTablaElse = new tablaSimbolo(tabla);
                newTablaElse.setNombre("Instruccion ELSE");
                for (let i of this.instrucciones2) {
                    if (i instanceof Break) return i;
                    if (i instanceof Continue) return i;
                    let resultado = i.interpretar(arbol, newTablaElse);
                    // falta validar errores para cuando vengan errores en i
                }
            }
        }
            
            
    
    }
    
}

export enum Operadores {
    SENT_IF,
    SENT_ELSE,
    SENT_ELSEIF
}