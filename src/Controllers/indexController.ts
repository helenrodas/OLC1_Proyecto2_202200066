import { Request, Response } from 'express';
import Arbol from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';
import Errores from './analisis/excepciones/Errores';
import Metodo from './analisis/instrucciones/Metodo';
import Declaracion from './analisis/instrucciones/Declaracion';
import Execute from './analisis/instrucciones/Execute';

export let listaErrores: Array<Errores> = []


class controller {
    public prueba(req: Request, res: Response) {
        res.json({ "funciona": "la api" });
    }

    public interpretar(req: Request, res: Response) {
        listaErrores = new Array<Errores>
        try {
            let parser = require('./analisis/analizador')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new tablaSimbolo()
            tabla.setNombre("TablaSimbolos")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")
            let execute = null;
            //primer recorrido del arbol

            for (let i of listaErrores){
                ast.Print(i.getTipoError()+ ":" + i.getDesc() + "Fila: " + i.getFila() + "Columna: " + i.getCol() )
            }
            for (let i of ast.getInstrucciones()) {
                if(i instanceof Errores){
                    listaErrores.push(i)
                }

                if (i instanceof Metodo) {
                    i.id = i.id.toLocaleLowerCase()
                    ast.addFunciones(i)
                }
                if(i instanceof Declaracion){
                    i.interpretar(ast, tabla)
                    if(i instanceof Errores){
                        listaErrores.push(i)
                    }
                }
                if (i instanceof Execute){
                    execute = i
                }
//execute solo puede venir una vez, si vienve mas debe dar error semantico

/*este if deja de funcionar al momento que se le agrega el execute(main) pues
ahora ya depende que exista la funcion execute para ejecutar el codigo
*/ 

                // var resultado = i.interpretar(ast, tabla)
                // if(resultado instanceof Errores){
                //     listaErrores.push(resultado)
                // }
                // console.log(resultado)
            }
            if(execute != null){
                execute.interpretar(ast,tabla)
                if (execute instanceof Errores){
                    listaErrores.push(execute)
                }
            }
            console.log(tabla)
            res.send({ "Respuesta": ast.getConsola() })
            
            console.log("Errores: ",listaErrores.length)
            for(let error of listaErrores){
                console.log(error.getTipoError())
                console.log(error.getDesc())
            }
        } catch (err: any) {
            console.log(err)
            res.send({ "Error": "Error en el analisis" })
        }
    }

}


export const indexController = new controller();