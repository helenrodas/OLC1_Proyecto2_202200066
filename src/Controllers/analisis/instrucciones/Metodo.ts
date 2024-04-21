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
                        //No hace esa validacion de tipos :(
                        // if(this.tipo.getTipo() != i.expresion.tipoDato.getTipo()){
                        //     arbol.Print("Error Semantico: El tipo de retorno no coincide con el tipo de la función. linea:"+ this.linea+" columna: " +(this.col+1));
                        //     return new Errores("Semantico", "El tipo de retorno no coincide con el tipo de la función", this.linea, this.col);
                        // }
                        return i.expresion;
                    }else{
                        arbol.Print("Error Semantico: return en funcion no retorna nada. linea:"+ this.linea+" columna: " +(this.col+1));
                        return new Errores("Semantico", "return en funcion no retorna nada", this.linea, this.col);
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

        let result = "";
        let contador = Contador.getInstancia();

        let contTipoParametro = [];
        let contParametros = [];
        let contInstrucciones = [];

        let padre = `n${contador.get()}`;
        let tipoFuncion = `n${contador.get()}`;
        let padreId = `n${contador.get()}`;
        let ident = `n${contador.get()}`;
        let par1 = `n${contador.get()}`;
        let parm = `n${contador.get()}`;

        for(let i = 0; i < this.parametros.length; i++){
            contTipoParametro.push(`n${contador.get()}`);
            contParametros.push(`n${contador.get()}`);
        }

        let par2 = `n${contador.get()}`;
        let llav1 = `n${contador.get()}`;
        let padreInstr = `n${contador.get()}`;

        for(let i= 0; i< this.instrucciones.length; i++){
            contInstrucciones.push(`n${contador.get()}`);
        }

        let llav2 = `n${contador.get()}`;

        result += `${padre}[label="metodo/funcion"];\n`
        if(this.tipo.getTipo() == tipoDato.VOID){
            result += `${tipoFuncion}[label="void"];\n`
        }else if(this.tipo.getTipo() == tipoDato.INTEGER){
            result += `${tipoFuncion}[label="int"];\n`
        }else if(this.tipo.getTipo() == tipoDato.DOUBLE){
            result += `${tipoFuncion}[label="double"];\n`
        }else if(this.tipo.getTipo() == tipoDato.STRING){
            result += `${tipoFuncion}[label="std::string"];\n`
        }else if(this.tipo.getTipo() == tipoDato.BOOLEAN){
            result += `${tipoFuncion}[label="bool"];\n`
        }

        result += `${padreId}[label="ID"];\n`
        result += `${ident}[label="${this.id}"];\n`
        result += `${par1}[label="("];\n`
        result += `${parm}[label="parametros"];\n`
        for(let i = 0; i < this.parametros.length; i++){
            if(this.parametros[i].tipo.getTipo() == tipoDato.INTEGER){
                result += `${contTipoParametro[i]}[label="int"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.DOUBLE){
                result += `${contTipoParametro[i]}[label="double"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.STRING){
                result += `${contTipoParametro[i]}[label="std::string"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.BOOLEAN){
                result += `${contTipoParametro[i]}[label="bool"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.VOID){
                result += `${contTipoParametro[i]}[label="void"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.CHAR){
                result += `${contTipoParametro[i]}[label="char"];\n`
            }
            
            result += `${contParametros[i]}[label="${this.parametros[i].id}"];\n`
        }
        result += `${par2}[label=")"];\n`
        result += `${llav1}[label="{"];\n`
        result += `${padreInstr}[label="instrucciones"];\n`
        for(let i = 0; i < this.instrucciones.length; i++){
            result += `${contInstrucciones[i]}[label="instruccion"];\n`
        }
        result += `${llav2}[label="}"];\n`

        result += `${padre} -> ${tipoFuncion};\n`
        result += `${padre} -> ${padreId};\n`
        result += `${padreId} -> ${ident};\n`
        result += `${padre} -> ${par1};\n`
        result += `${padre} -> ${parm};\n`

        for(let i = 0; i < this.parametros.length; i++){
            result += `${parm} -> ${contTipoParametro[i]};\n`
            result += `${parm} -> ${contParametros[i]};\n`
        }

        result += `${padre} -> ${par2};\n`

        result += `${padre} -> ${llav1};\n`

        result += `${padre} -> ${padreInstr};\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            result += `${padreInstr} -> ${contInstrucciones[i]};\n`
        }

        result += `${padre} -> ${llav2};\n`

        result += `${anterior} -> ${padre};\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            result += this.instrucciones[i].ArbolGraph(contInstrucciones[i]);
        }


        return result;
    }

}