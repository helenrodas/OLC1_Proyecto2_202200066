import { Request, Response } from 'express';
import Arbol from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';
import Errores from './analisis/excepciones/Errores';
import Metodo from './analisis/instrucciones/Metodo';
import Declaracion from './analisis/instrucciones/Declaracion';
import Execute from './analisis/instrucciones/Execute';
import Contador from './analisis/simbolo/Contador';

export let listaErrores: Array<Errores> = []

var AstDot: string
class controller {
    public prueba(req: Request, res: Response) {
        res.json({ "funciona": "la api" });
    }

    public interpretar(req: Request, res: Response) {
        listaErrores = new Array<Errores>
       
        try {
            let executeEncontrado = false;
            AstDot = ""
            let parser = require('./analisis/analizador')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new tablaSimbolo()
            tabla.setNombre("TablaSimbolos")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")
            let execute = null;
            //primer recorrido del arbol

            for (let i of listaErrores){
                ast.Print("Error Lexico" + i.getTipoError()+ ":" + i.getDesc() + "Fila: " + i.getFila() + "Columna: " + i.getCol() )
            }
            for (let i of ast.getInstrucciones()) {
                if(i instanceof Errores){
                    listaErrores.push(i)
                }

                if (i instanceof Metodo) {
                    i.id = i.id.toLocaleLowerCase()
                    ast.addFunciones(i)
                    if(i instanceof Errores){
                        listaErrores.push(i)
                    }
                }
                if(i instanceof Declaracion){
                    i.interpretar(ast, tabla)
                    if(i instanceof Errores){
                        listaErrores.push(i)
                    }
                }
                if (i instanceof Execute){
                    if(executeEncontrado){
                        ast.Print("Error Semantico: Solo se permite una instancia de Execute");
                        const error = new Errores("Semántico", "Solo se permite una instancia de Execute", 0, 0);
                        listaErrores.push(error);
                        break;
                    }
                    executeEncontrado = true;
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
               let res= execute.interpretar(ast,tabla)
                if (res instanceof Errores){
                    listaErrores.push(res)
                }
            }
            console.log(tabla)
            let contador = Contador.getInstancia()
            let cadena = "digraph ast{\n"
            cadena += "nINICIO[label=\"INICIO\"];\n"
            cadena += "nINSTRUCCIONES[label=\"INSTRUCCIONES\"];\n"
            cadena += "nINICIO->nINSTRUCCIONES;\n"

            for (let i of ast.getInstrucciones()) {
                if (i instanceof Errores) continue
                let nodo = `n${contador.get()}`
                cadena += `${nodo}[label=\"INSTRUCCION\"];\n`
                cadena += `nINSTRUCCIONES->${nodo};\n`
                cadena += i.ArbolGraph(nodo)
            }
            cadena += "\n}"
            AstDot = cadena
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

    public arbolAST(req: Request, res: Response) {
        res.json({ AST: AstDot })
    }

    public getListaErrores(req: Request, res: Response) {
        
        res.json({ listaErrores : listaErrores })
    }
    
        
}


export const indexController = new controller();