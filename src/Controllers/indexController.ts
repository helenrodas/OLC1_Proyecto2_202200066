import { Request, Response } from 'express';
import Arbol from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';
import Errores from './analisis/excepciones/Errores';

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

            for (let i of listaErrores){
                ast.Print(i.getTipoError()+ ":" + i.getDesc() + "Fila: " + i.getFila() + "Columna: " + i.getCol() )
            }

            for (let i of ast.getInstrucciones()) {

                if(i instanceof Errores){
                    listaErrores.push(i)
                }
                
                var resultado = i.interpretar(ast, tabla)

                if(resultado instanceof Errores){
                    listaErrores.push(resultado)
                }
                console.log(resultado)
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