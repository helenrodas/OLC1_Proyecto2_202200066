import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Metodo from './Metodo';
import Declaracion from "./Declaracion";


export default class Llamada extends Instruccion {
    private id: string;
    private parametros: Instruccion[];

    constructor(id: string, parametros: Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna);
        this.id = id;
        this.parametros = parametros;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let BuscarFuncion = arbol.getFuncion(this.id.toLocaleLowerCase());
        
        if (BuscarFuncion == null) {
            arbol.Print(`Error Semantico: Funcion ${this.id}. no existe  Linea: ${this.linea} Columna: ${(this.col + 1)}`);
            return new Errores('Semantico', `Funcion ${this.id} no existe `, this.linea, this.col);
        }

        this.tipoDato.setTipo(BuscarFuncion.tipoDato.getTipo());

        if (BuscarFuncion instanceof Metodo) {

            if (BuscarFuncion.tipoDato.getTipo() == tipoDato.VOID) {
                let tablaTemp = new tablaSimbolo(tabla);
                tablaTemp.setNombre("Tabla metodo " + this.id);

                if (BuscarFuncion.parametros.length != this.parametros.length) {
                    arbol.Print(`Error Semantico: Numero de parametros no es el esperado para la funcion ${this.id}. Linea: ${this.linea} Columna: ${(this.col + 1)}`);
                    return new Errores('Semantico', `Numero de parametros no es el esperado para la funcion ${this.id}`, this.linea, this.col);
                }

                for (let i = 0; i < BuscarFuncion.parametros.length; i++) {
                    //revisar por indice puede dar posible error en id [0]
                    let nuevaDeclaracion = new Declaracion(BuscarFuncion.parametros[i].tipo, this.linea, this.col, [BuscarFuncion.parametros[i].id], this.parametros[i]);

                    //interpreta la declaracion
                    let interpretacionDecla = nuevaDeclaracion.interpretar(arbol, tablaTemp);

                    if (interpretacionDecla instanceof Errores) return interpretacionDecla;
                }

                let funcionInter: any = BuscarFuncion.interpretar(arbol, tablaTemp);
                if (funcionInter instanceof Errores) return funcionInter;

            } else {

                let tablaTemp = new tablaSimbolo(tabla);
                tablaTemp.setNombre("Tabla Funcion " + this.id);

                if (BuscarFuncion.parametros.length != this.parametros.length) {
                    arbol.Print(`Error Semantico: Numero de parametros no es el esperado para la funcion ${this.id}. Linea: ${this.linea} Columna: ${(this.col + 1)}`);
                    return new Errores('Semántico', `Numero de parametros no es el esperado para la funcion ${this.id}`, this.linea, this.col);
                }

                for (let i = 0; i < BuscarFuncion.parametros.length; i++) {
                    let nuevoParametro = this.parametros[i].interpretar(arbol, tablaTemp);
                    let nuevaDeclaracion = new Declaracion(BuscarFuncion.parametros[i].tipo, this.linea, this.col, [BuscarFuncion.parametros[i].id[0]], this.parametros[i]);

                    let valInterpretado = nuevaDeclaracion.interpretar(arbol, tablaTemp);

                    if (valInterpretado instanceof Errores) return valInterpretado;

                    let varInterpretada = tablaTemp.getVariable(BuscarFuncion.parametros[i].id[0]);

                    if(varInterpretada != null){
                        if(BuscarFuncion.parametros[i].tipo.getTipo() != varInterpretada.getTipo().getTipo()){
                            arbol.Print(`Error Semantico: El parametro no coincide con la funcion ${this.id}. Linea: ${this.linea} Columna: ${(this.col + 1)}`);
                            return new Errores('Semantico', `El parametro no coincide con la funcion ${this.id}`, this.linea, this.col);
                        }else{
                            varInterpretada.setValor(nuevoParametro);  
                        }
                    }else{

                        arbol.Print(`Error Semantico: El parametro no coincide con la funcion ${this.id}. Linea: ${this.linea} Columna: ${(this.col + 1)}`);
                        return new Errores('Semantico', `El parametro no coincide con la funcion ${this.id}`, this.linea, this.col);
                    
                    }

                }

                let ResultFunction: any = BuscarFuncion.interpretar(arbol, tablaTemp);
                if (ResultFunction instanceof Errores) return ResultFunction;
                return BuscarFuncion.returnValue.interpretar(arbol, tablaTemp);


            }


        }

    }

    // obtenerAST(anterior: string): string {

    //     let contador = ContadorSingleton.getInstance();
    //     let result = "";

    //     let llamada = `n${contador.getContador()}`;
    //     let ident = `n${contador.getContador()}`;
    //     let par1 = `n${contador.getContador()}`;
    //     let puntocoma = `n${contador.getContador()}`;

    //     let arrayParametros = [];

    //     for (let i = 0; i < this.parametros.length; i++) {
    //         arrayParametros.push(`n${contador.getContador()}`);
    //     }

    //     let par2 = `n${contador.getContador()}`;

    //     result += `${llamada}[label="Llamada"];\n`;
    //     result += `${ident}[label="${this.id}"];\n`;
    //     result += `${par1}[label="("];\n`;

    //     for(let i = 0; i < this.parametros.length; i++){
    //         result += `${arrayParametros[i]}[label="Parametro"];\n`;
    //     }

    //     result += `${par2}[label=")"];\n`;
    //     result += `${puntocoma}[label=";"];\n`


    //     result += `${anterior} -> ${llamada};\n`;
    //     result += `${llamada} -> ${ident};\n`;
    //     result += `${llamada} -> ${par1};\n`;

    //     for(let i = 0; i < this.parametros.length; i++){
    //         result += `${llamada} -> ${arrayParametros[i]};\n`;
    //     }

    //     result += `${llamada} -> ${par2};\n`;
    //     result += `${llamada} -> ${puntocoma};\n`;
        
    //     for(let i = 0; i < this.parametros.length; i++){
    //         result += this.parametros[i].obtenerAST(arrayParametros[i]);
    //     }

    //     return result;
    // }

}