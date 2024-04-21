import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Declaracion from "./Declaracion";
import Metodo from "./Metodo";
import Contador from "../simbolo/Contador";

export default class Execute extends Instruccion {
    private id: string
    private parametros: Instruccion[]

    constructor(id: string, linea: number, col: number, parametros: Instruccion[]) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.id = id
        this.parametros = parametros
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let busqueda = arbol.getFuncion(this.id)
        if (busqueda == null) return new Errores("SEMANTICO", "Funcion no existente", this.linea, this.col)

        if (busqueda instanceof Metodo) {
            let newTabla = new tablaSimbolo(arbol.getTablaGlobal())
            newTabla.setNombre("Metodo Execute")


            if (busqueda.parametros.length != this.parametros.length) {
                return new Errores("SEMANTICO", "Parametros invalidos", this.linea, this.col)
            }

            // declaramos los parametros
            for (let i = 0; i < busqueda.parametros.length; i++) {
                // console.log(busqueda.parametros[i].tipo)
                // console.log(busqueda)
                let declaracionParametro = new Declaracion(
                    busqueda.parametros[i].tipo, this.linea, this.col,
                    busqueda.parametros[i].id, this.parametros[i])

                // declarando parametro de metodo
                let resultado = declaracionParametro.interpretar(arbol, newTabla)
                if (resultado instanceof Errores) return resultado
            }
            // una vez declarados los parametros, interpretamos la funcion
            let resultadoFuncion: any = busqueda.interpretar(arbol, newTabla)
            if (resultadoFuncion instanceof Errores) return resultadoFuncion

        }
    }

    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let result = "";


        let executee = `n${contador.get()}`;
        let ident = `n${contador.get()}`;
        let par1 = `n${contador.get()}`;
        let padreParametros = `n${contador.get()}`;
        let contParametros = [];

        for (let i = 0; i < this.parametros.length; i++) {
            contParametros.push(`n${contador.get()}`);
        }

        let par2 = `n${contador.get()}`;
        let puntocoma = `n${contador.get()}`;

        result += `${executee}[label="Execute"];\n`;
        result += `${ident}[label="${this.id}"];\n`;
        result += `${par1}[label="("];\n`;
        result += `${padreParametros}[label="Parametros"];\n`;
        result += `${par2}[label=")"];\n`;
        result += `${puntocoma}[label=";"];\n`;

        for(let i = 0; i < this.parametros.length; i++){
            result += `${contParametros[i]}[label="Expresion"];\n`;
        }

        result += `${anterior} -> ${executee};\n`;
        result += `${anterior} -> ${ident};\n`;
        result += `${anterior} -> ${par1};\n`;
        result += `${anterior} -> ${padreParametros};\n`;
        for(let i = 0; i < this.parametros.length; i++){
            result += `${padreParametros} -> ${contParametros[i]};\n`;
        }
        result += `${anterior} -> ${par2};\n`;
        result += `${anterior} -> ${puntocoma};\n`;

        for (let i = 0; i < this.parametros.length; i++) {
            result += this.parametros[i].ArbolGraph(contParametros[i]);
        }

        return result;
    }
}
