import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Return from "./Return";
import Contador from "../simbolo/Contador";

export default class Metodo extends Instruccion {

    public id: string;
    public instrucciones: Instruccion[];
    public tipo: Tipo;
    public parametros: any = [];
    public returnValue: any = Instruccion;

    constructor(id: string, tipo: Tipo, parametros: any[], instrucciones: Instruccion[], linea: number, columna: number) {
        super(tipo, linea, columna);
        this.id = id;
        this.tipo = tipo;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //Esto aplica cuando es un metodo porque no trae return, es void
        if (this.tipo.getTipo() == tipoDato.VOID) {

            for (let i of this.instrucciones) {

                let instruccion = i.interpretar(arbol, tabla);

                if (instruccion instanceof Errores) {
                    return instruccion;
                }

                if (instruccion instanceof Return) {
                    if (instruccion.expresion != undefined) {
                        return instruccion;
                    }
                    return;
                }
            }
        }else{
            //Esto es cuando es una funcion porque valida que traiga return
            let ReturnEncontrado = false;
            
            for(let i of this.instrucciones){

                if(i instanceof Return){
                    ReturnEncontrado = true;

                    if(i.expresion != undefined){
                        this.returnValue = i.expresion;

                        return i.expresion;
                    }else{
                        arbol.Print("Error Semantico: El return en la funcion es indefinido"+ "Linea: " + this.linea+" columna: " +(this.col+1));
                        return new Errores("SEMANTICO", "El return en la funcion es indefinido", this.linea, this.col)
                    }
                }
                let resultado = i.interpretar(arbol, tabla);
                if(resultado instanceof Errores){
                    return resultado;
                }

                if(resultado instanceof Return){
                    if(resultado.expresion != undefined){
                        ReturnEncontrado = true;
                        this.returnValue = resultado.expresion;
                        return resultado.expresion;
                    }else{
                    
                        arbol.Print("Error Semantico: La funcion no retorna nada. linea:"+ this.linea+" columna: " +(this.col+1));
                    
                        return new Errores("Semantico", "La funcion no retorna un valor", this.linea, this.col);
                    }
                }

            }

            if(ReturnEncontrado == false){
            
                arbol.Print("Error Semantico: Funcion invalida, falta return. linea:"+ this.linea+" columna: " +(this.col+1));
            
                return new Errores("Semantico", "Funcion invalida, falta return", this.linea, this.col);
            }

        }
    }

    ArbolGraph(anterior: string): string {

        let resultado = "";
        let contador = Contador.getInstancia();

      
        let listaTipos = [];
        let listaParametros = [];
      
        let listaInstrucciones = [];

        
        let padre = `n${contador.get()}`;
        let tipoFuncion = `n${contador.get()}`;
        let padreId = `n${contador.get()}`;
        let ident = `n${contador.get()}`;
        let par1 = `n${contador.get()}`;
        let parm = `n${contador.get()}`;

        for(let i = 0; i < this.parametros.length; i++){
            listaTipos.push(`n${contador.get()}`);
            listaParametros.push(`n${contador.get()}`);
        }

        let par2 = `n${contador.get()}`;
        let llav1 = `n${contador.get()}`;
        let padreInstr = `n${contador.get()}`;

        for(let i= 0; i< this.instrucciones.length; i++){
            listaInstrucciones.push(`n${contador.get()}`);
        }

        let llav2 = `n${contador.get()}`;

        resultado += `${padre}[label="metodo/funcion"];\n`
        if(this.tipo.getTipo() == tipoDato.VOID){
            resultado += `${tipoFuncion}[label="void"];\n`
        }else if(this.tipo.getTipo() == tipoDato.INTEGER){
            resultado += `${tipoFuncion}[label="int"];\n`
        }else if(this.tipo.getTipo() == tipoDato.DOUBLE){
            resultado += `${tipoFuncion}[label="double"];\n`
        }else if(this.tipo.getTipo() == tipoDato.STRING){
            resultado += `${tipoFuncion}[label="std::string"];\n`
        }else if(this.tipo.getTipo() == tipoDato.BOOLEAN){
            resultado += `${tipoFuncion}[label="bool"];\n`
        }

        resultado += `${padreId}[label="ID"];\n`
        resultado += `${ident}[label="${this.id}"];\n`
        resultado += `${par1}[label="("];\n`
        resultado += `${parm}[label="parametros"];\n`
        for(let i = 0; i < this.parametros.length; i++){
            if(this.parametros[i].tipo.getTipo() == tipoDato.INTEGER){
                resultado += `${listaTipos[i]}[label="int"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.DOUBLE){
                resultado += `${listaTipos[i]}[label="double"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.STRING){
                resultado += `${listaTipos[i]}[label="std::string"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.BOOLEAN){
                resultado += `${listaTipos[i]}[label="bool"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.VOID){
                resultado += `${listaTipos[i]}[label="void"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.CHAR){
                resultado += `${listaTipos[i]}[label="char"];\n`
            }
            
            resultado += `${listaParametros[i]}[label="${this.parametros[i].id}"];\n`
        }
        resultado += `${par2}[label=")"];\n`
        resultado += `${llav1}[label="{"];\n`
        resultado += `${padreInstr}[label="instrucciones"];\n`
        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += `${listaInstrucciones[i]}[label="instruccion"];\n`
        }
        resultado += `${llav2}[label="}"];\n`

        resultado += `${padre} -> ${tipoFuncion};\n`
        resultado += `${padre} -> ${padreId};\n`
        resultado += `${padreId} -> ${ident};\n`
        resultado += `${padre} -> ${par1};\n`
        resultado += `${padre} -> ${parm};\n`

        for(let i = 0; i < this.parametros.length; i++){
            resultado += `${parm} -> ${listaTipos[i]};\n`
            resultado += `${parm} -> ${listaParametros[i]};\n`
        }

        resultado += `${padre} -> ${par2};\n`

        resultado += `${padre} -> ${llav1};\n`

        resultado += `${padre} -> ${padreInstr};\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += `${padreInstr} -> ${listaInstrucciones[i]};\n`
        }

        resultado += `${padre} -> ${llav2};\n`

        resultado += `${anterior} -> ${padre};\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += this.instrucciones[i].ArbolGraph(listaInstrucciones[i]);
        }


        return resultado;
    }

}