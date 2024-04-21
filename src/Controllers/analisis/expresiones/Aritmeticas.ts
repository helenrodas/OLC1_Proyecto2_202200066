import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";


export default class Aritmeticas extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: Operadores
    private operandoUnico: Instruccion | undefined

    constructor(operador: Operadores, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
        super(new Tipo(tipoDato.INTEGER), fila, col)
        this.operacion = operador
        if (!op2) this.operandoUnico = op1
        else {
            this.operando1 = op1
            this.operando2 = op2
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq, opDer, Unico = null
        if (this.operandoUnico != null) {
            Unico = this.operandoUnico.interpretar(arbol, tabla)
            if (Unico instanceof Errores) return Unico
        } else {
            opIzq = this.operando1?.interpretar(arbol, tabla)
            if (opIzq instanceof Errores) return opIzq
            opDer = this.operando2?.interpretar(arbol, tabla)
            if (opDer instanceof Errores) return opDer
        }

        switch (this.operacion) {
            case Operadores.SUMA:
                return this.suma(opIzq, opDer)
            case Operadores.RESTA:
                return this.resta(opIzq, opDer)
            case Operadores.MULT:
                return this.mult(opIzq, opDer)
            case Operadores.DIVI:
                return this.div(opIzq, opDer)
            case Operadores.NEG:
                return this.negacion(Unico)
            case Operadores.ARI_POTENCIA:
                return this.potencia(opIzq, opDer)
            case Operadores.ARI_MODULO:
                return this.modulo(opIzq, opDer)
            default:
                return new Errores("Semantico", "Operador Aritmetico Invalido", this.linea, this.col)
        }
    }

    suma(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseInt(op1) + parseInt(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) + parseFloat(op2)
                    case tipoDato.STRING:
                        this.tipoDato = new Tipo(tipoDato.STRING)
                        return op1 + op2;
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        console.log(op2.charCodeAt(1))
                        return parseInt(op1) + parseInt(op2.charCodeAt(1))
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        if(op2 == 'true'){
                            return parseInt(op1) + 1;
                        }else{
                            return parseInt(op1) + 0;
                        }
                        
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) + parseFloat(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        
                        return parseFloat(op1) + parseFloat(op2)
                    case tipoDato.BOOLEAN:
                            this.tipoDato = new Tipo(tipoDato.DOUBLE)
                            if(op2 == 'true'){
                                return parseFloat(op1) + 1
                            }else{
                                return parseFloat(op1) + 0
                            }
                    case tipoDato.CHAR:
                                this.tipoDato = new Tipo(tipoDato.INTEGER)
                                console.log(op2.charCodeAt(1))
                                return parseFloat(op1) + parseFloat(op2.charCodeAt(1))
                    case tipoDato.STRING:
                            this.tipoDato = new Tipo(tipoDato.STRING)
                            return op1 + op2;
                            
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        if(op1 == 'true'){
                            return 1 + parseInt(op2)
                        }else{
                            return 0 + parseInt(op2)
                        }
                        
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        if(op1 == 'true'){
                            return 1 + parseFloat(op2)
                        }else{
                            return 0 + parseFloat(op2)
                        } 
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)   
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                            this.tipoDato = new Tipo(tipoDato.STRING)
                            if(op1 == 'true'){
                                return 1 + op2
                            }else{
                                return 0 + op2
                            }
                            
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseInt(op1.charCodeAt(1)) + parseInt(op2)
                        
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1.charCodeAt(1)) + parseFloat(op2)
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                    case tipoDato.CHAR:    
                        this.tipoDato = new Tipo(tipoDato.STRING)
                        return op1 + op2
                    case tipoDato.STRING:
                            this.tipoDato = new Tipo(tipoDato.STRING)
                            return op1 + op2
                            
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.STRING:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.STRING)
                        return op1 + op2
                        
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.STRING)
                        return op1 + op2
                    case tipoDato.BOOLEAN:    
                        this.tipoDato = new Tipo(tipoDato.STRING)
                        return op1 + op2
                    case tipoDato.CHAR:    
                        this.tipoDato = new Tipo(tipoDato.STRING)
                        return op1 + op2
                    case tipoDato.STRING:
                            this.tipoDato = new Tipo(tipoDato.STRING)
                            return op1 + op2
                            
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
        }

    }

    resta(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseInt(op1) - parseInt(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) - parseFloat(op2)
                    case tipoDato.BOOLEAN:
                        this.tipoDato =  new Tipo(tipoDato.INTEGER)
                        if(op2 == 'true'){
                            return parseInt(op1) - 1
                        }else{
                            return parseInt(op1) - 0
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseFloat(op1) - parseInt(op2.charCodeAt(1))
                    case tipoDato.STRING:
                        console.log("ERROR SEMANTICO")
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) - parseFloat(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) - parseFloat(op2)
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        if(op2 == 'true'){
                            return parseFloat(op1) - 1
                        }else{
                            return parseFloat(op1) - 0
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) - parseFloat(op2.charCodeAt(1))
                    case tipoDato.STRING:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        if(op1 == 'true'){
                            return 1 - parseInt(op2)
                        }else{
                            return 0 - parseInt(op2)
                        }    
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        if(op1 == 'true'){
                            return 1 - parseFloat(op2)
                        }else{
                            return 0 - parseFloat(op2)
                        }   
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseInt(op1.charCodeAt(1)) - parseInt(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1.charCodeAt(1)) - parseFloat(op2)   
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.CHAR:
                    switch (tipo2) {
                        case tipoDato.INTEGER:
                            this.tipoDato = new Tipo(tipoDato.INTEGER)
                            return parseInt(op1.charCodeAt(1)) - parseInt(op2)
                        case tipoDato.DOUBLE:
                            this.tipoDato = new Tipo(tipoDato.DOUBLE)
                            return parseFloat(op1.charCodeAt(1)) - parseFloat(op2)   
                        case tipoDato.BOOLEAN:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                        case tipoDato.CHAR:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                        case tipoDato.STRING:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                        default:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    }
            case tipoDato.STRING:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.DOUBLE:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
        }

    }


    mult(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseInt(op1) * parseInt(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) * parseFloat(op2)
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseFloat(op1) * parseInt(op2.charCodeAt(1))
                    case tipoDato.STRING:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) * parseFloat(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) * parseFloat(op2)
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) * parseFloat(op2.charCodeAt(1))
                    case tipoDato.STRING:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)  
                    case tipoDato.DOUBLE:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col) 
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseInt(op1.charCodeAt(1)) * parseInt(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1.charCodeAt(1)) * parseFloat(op2)   
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            case tipoDato.CHAR:
                    switch (tipo2) {
                        case tipoDato.INTEGER:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        case tipoDato.DOUBLE:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        case tipoDato.BOOLEAN:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        case tipoDato.CHAR:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        case tipoDato.STRING:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        default:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    }
            case tipoDato.STRING:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.DOUBLE:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
        }

    }


    div(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseInt(op1) / parseInt(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) / parseFloat(op2)
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) / parseInt(op2.charCodeAt(1))
                    case tipoDato.STRING:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) / parseFloat(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) / parseFloat(op2)
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) / parseFloat(op2.charCodeAt(1))
                    case tipoDato.STRING:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)  
                    case tipoDato.DOUBLE:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col) 
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return parseInt(op1.charCodeAt(1)) / parseInt(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1.charCodeAt(1)) / parseFloat(op2)   
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            case tipoDato.CHAR:
                    switch (tipo2) {
                        case tipoDato.INTEGER:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        case tipoDato.DOUBLE:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        case tipoDato.BOOLEAN:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        case tipoDato.CHAR:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        case tipoDato.STRING:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        default:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    }
            case tipoDato.STRING:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.DOUBLE:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.BOOLEAN:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CHAR:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.STRING:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
        }

    }

    potencia(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.INTEGER)
                        return Math.pow(parseInt(op1),parseInt(op2))
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return Math.pow(parseFloat(op1),parseFloat(op2))
                    default:
                        return new Errores("Semantico", "Operacion potencia invalida", this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return Math.pow(parseFloat(op1),parseFloat(op2))
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return Math.pow(parseFloat(op1),parseFloat(op2))
                    default:
                        return new Errores("Semantico", "Operacion potencia invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Operacion potencia invalida", this.linea, this.col)
        }

    }

    modulo(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) % parseFloat(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) % parseFloat(op2)
                    default:
                        return new Errores("Semantico", "Operacion modulo invalida", this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) % parseFloat(op2)
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.DOUBLE)
                        return parseFloat(op1) % parseFloat(op2)
                    default:
                        return new Errores("Semantico", "Operacion modulo invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Operacion modulo invalida", this.linea, this.col)
        }

    }

    negacion(op1: any) {
        let opU = this.operandoUnico?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.INTEGER:
                this.tipoDato = new Tipo(tipoDato.INTEGER)
                return parseInt(op1) * -1
            case tipoDato.DOUBLE:
                this.tipoDato = new Tipo(tipoDato.DOUBLE)
                return parseFloat(op1) * -1
            default:
                return new Errores("Semantico", "Negacion Unaria invalida", this.linea, this.col)
        }
    }

    ArbolGraph(anterior: string): string {

        let contador = Contador.getInstancia();
        let result = ""
        if (this.operacion == Operadores.NEG) {

            let nodoNeg = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            result += `${nodoNeg}[label=\"Negacion Unaria\"];\n`
            result += `${nodoExp}[label=\"Expresion\"];\n`
            result += `${anterior}->${nodoNeg};\n`
            result += `${anterior}-> ${nodoExp};\n`
            result += this.operandoUnico?.ArbolGraph(nodoExp)
            //return result;
        } else if (this.operacion == Operadores.SUMA) {

            let exp1 = `n${contador.get()}`
            let nodoOp = `n${contador.get()}`
            let exp2 = `n${contador.get()}`

            result += `${exp1}[label= \"Expresion\"];\n`
            result += `${nodoOp}[label=\"+\"];\n`
            result += `${exp2}[label=\"Expresion\"];\n`
            result += `${anterior} -> ${exp1};\n`
            result += `${anterior} -> ${nodoOp};\n`
            result += `${anterior} -> ${exp2};\n`
            result += this.operando1?.ArbolGraph(exp1)
            result += this.operando2?.ArbolGraph(exp2)

        }else if(this.operacion == Operadores.RESTA){

            let exp1 = `n${contador.get()}`
            let nodoOp = `n${contador.get()}`
            let exp2 = `n${contador.get()}`

            result += `${exp1}[label= \"Expresion\"];\n`
            result += `${nodoOp}[label=\"-\"];\n`
            result += `${exp2}[label=\"Expresion\"];\n`
            result += `${anterior} -> ${exp1};\n`
            result += `${anterior} -> ${nodoOp};\n`
            result += `${anterior} -> ${exp2};\n`
            result += this.operando1?.ArbolGraph(exp1)
            result += this.operando2?.ArbolGraph(exp2)

        }else if(this.operacion == Operadores.MULT){

            let exp1 = `n${contador.get()}`
            let nodoOp = `n${contador.get()}`
            let exp2 = `n${contador.get()}`

            result += `${exp1}[label= \"Expresion\"];\n`
            result += `${nodoOp}[label=\"*\"];\n`
            result += `${exp2}[label=\"Expresion\"];\n`
            result += `${anterior} -> ${exp1};\n`
            result += `${anterior} -> ${nodoOp};\n`
            result += `${anterior} -> ${exp2};\n`
            result += this.operando1?.ArbolGraph(exp1)
            result += this.operando2?.ArbolGraph(exp2)
        }else if(this.operacion == Operadores.DIVI){

            let exp1 = `n${contador.get()}`
            let nodoOp = `n${contador.get()}`
            let exp2 = `n${contador.get()}`

            result += `${exp1}[label= \"Expresion\"];\n`
            result += `${nodoOp}[label=\"/\"];\n`
            result += `${exp2}[label=\"Expresion\"];\n`
            result += `${anterior} -> ${exp1};\n`
            result += `${anterior} -> ${nodoOp};\n`
            result += `${anterior} -> ${exp2};\n`
            result += this.operando1?.ArbolGraph(exp1)
            result += this.operando2?.ArbolGraph(exp2)

        }else if(this.operacion == Operadores.ARI_MODULO){

            let exp1 = `n${contador.get()}`
            let nodoOp = `n${contador.get()}`
            let exp2 = `n${contador.get()}`

            result += `${exp1}[label= \"Expresion\"];\n`
            result += `${nodoOp}[label=\"%\"];\n`
            result += `${exp2}[label=\"Expresion\"];\n`
            result += `${anterior} -> ${exp1};\n`
            result += `${anterior} -> ${nodoOp};\n`
            result += `${anterior} -> ${exp2};\n`
            result += this.operando1?.ArbolGraph(exp1)
            result += this.operando2?.ArbolGraph(exp2)
        }else if(this.operacion == Operadores.ARI_POTENCIA){

            let exp1 = `n${contador.get()}`
            let exp2 = `n${contador.get()}`
            let par1 = `n${contador.get()}`
            let par2 = `n${contador.get()}`
            let nodoPow = `n${contador.get()}`
            let nodoComa = `n${contador.get()}`
            result += `${nodoPow}[label="pow"];\n`
            result += `${par1}[label="("];\n`
            result += `${exp1}[label="Expresion"];\n`
            result += `${nodoComa}[label=","];\n`
            result += `${exp2}[label="Expresion"];\n`
            result += `${par2}[label=")"];\n`
            result += `${anterior} -> ${nodoPow};\n`
            result += `${anterior} -> ${par1};\n`
            result += `${anterior} -> ${exp1};\n`
            result += `${anterior} -> ${nodoComa};\n`
            result += `${anterior} -> ${exp2};\n`
            result += `${anterior} -> ${par2};\n`

            result += this.operando1?.ArbolGraph(exp1)
            result += this.operando2?.ArbolGraph(exp2)

        }

        return result;


    }

}

export enum Operadores {
    SUMA,
    RESTA,
    MULT,
    DIVI,
    NEG,
    ARI_POTENCIA,
    ARI_MODULO
}