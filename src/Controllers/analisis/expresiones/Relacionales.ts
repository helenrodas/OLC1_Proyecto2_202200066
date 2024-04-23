import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";


export default class Relacionales extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: Operadores
    private operandoUnico: Instruccion | undefined

    constructor(operador: Operadores, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
        super(new Tipo(tipoDato.BOOLEAN), fila, col)
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
            case Operadores.IGUALACIONDOBLE:
                return this.comparacion(opIzq, opDer)
            case Operadores.DIFERENCIACION:
                return this.diferenciacion(opIzq, opDer)
            case Operadores.MENOR:
                return this.menor_que(opIzq, opDer)
            case Operadores.MENORIGUAL:
                return this.menor_igual(opIzq, opDer)
            case Operadores.MAYOR:
                return this.mayor_que(opIzq, opDer)
            case Operadores.MAYORIGUAL:
                return this.mayor_igual(opIzq,opDer)
            default:
                return new Errores("Semantico", "Operador Aritmetico Invalido", this.linea, this.col)
        }
    }

    comparacion(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(op1 == op2.charCodeAt(1)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(parseInt(op1) == 1 && op2 == true){
                            return true
                        }else{
                            return false
                        }
                        
                    default:
                        return new Errores("Semantico", "No se puede operar entero con: " + op2, this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(op1 == op2.charCodeAt(1)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(parseInt(op1) == 1 && op2 == true){
                            return true
                        }else{
                            return false
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar doble con: " + op2, this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        return op1 == op2
                    default:
                        return new Errores("Semantico", "No se puede operar boolean con: " + op2, this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1.charCodeAt(1) == op2){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1.charCodeAt(1) == op2){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:    
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1.charCodeAt(1) == op2.charCodeAt(1)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) == 1 && op2 == true){
                            return true
                        }else{
                            return false
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar char con: " + op2, this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "comparacion Invalida", this.linea, this.col)
        }

    }

    diferenciacion(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(op1 == op2.charCodeAt(1)){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) == 1 && op2 == true){
                            return false
                        }else{
                            return true
                        }
                        
                    default:
                        return new Errores("Semantico", "No se puede operar entero con: " + op2, this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == op2.charCodeAt(1)){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) == 1 && op2 == 'true'){
                            return false
                        }else{
                            return true
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar doble con: " + op2, this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        return op1 != op2
                    default:
                        return new Errores("Semantico", "No se puede operar boolean con: " + op2, this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1.charCodeAt(1) == op2){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1.charCodeAt(1) == op2){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.CHAR:    
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1.charCodeAt(1) == op2.charCodeAt(1)){
                            return false
                        }else{
                            return true
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt) == 1 && op2 == true){
                            return false
                        }else{
                            return true
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar char con: " + op2, this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "comparacion Invalida", this.linea, this.col)
        }
    }
    menor_que(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) < parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) < parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(parseInt(op1) < parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 === true){
                            return parseInt(op1) < 1;
                        }else{
                            return parseInt(op1) < 0;
                        }
                        
                    default:
                        return new Errores("Semantico", "No se puede operar entero con: " + op2, this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) < parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) < parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) < parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseInt(op1) < 1;
                        }else{
                            return parseInt(op1) < 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar doble con: " + op2, this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) < parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) < parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:    
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) < parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseInt(op1.charCodeAt(1)) < 1;
                        }else{
                            return parseInt(op1) < 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar char con: " + op2, this.linea, this.col)
                }
                case tipoDato.BOOLEAN:
                    switch (tipo2) {
                        case tipoDato.BOOLEAN:
                            this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                            if(op1 == false && op2 == true ){
                                return 0 < 1;
                            }else  if(op1 == true && op2 == false ){
                                return 1 < 0;
                            }else{
                                return false
                            }
                        default:
                            return new Errores("Semantico", "No se puede operar boolean con: " + op2, this.linea, this.col)
                    }
            default:
                return new Errores("Semantico", "Operacion Relacional Invalida", this.linea, this.col)
        }
    }
    menor_igual(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) <= parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) <= parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(parseInt(op1) <= parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(op2 == true){
                            return parseFloat(op1) <= 1;
                        }else{
                            return parseFloat(op1) <= 0;
                        }
                        
                    default:
                        return new Errores("Semantico", "No se puede operar entero con: " + op2, this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) <= parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) <= parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) <= parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseFloat(op1) <= 1;
                        }else{
                            return parseFloat(op1) <= 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar doble con: " + op2, this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) <= parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) <= parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:    
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) <= parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseInt(op1.charCodeAt(1)) <= 1;
                        }else{
                            return parseInt(op1.charCodeAt(1)) <= 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar char con: " + op2, this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == false && op2 == true ){
                            return 0 <= 1;
                        }else  if(op1 == true && op2 == false ){
                            return 1 <= 0;
                        }else{
                            return false
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar boolean con: " + op2, this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Operacion Relacional Invalida", this.linea, this.col)
        }
    }
    mayor_que(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) > parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) > parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(parseInt(op1) > parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseInt(op1) > 1;
                        }else{
                            return parseInt(op1) > 0;
                        }
                        
                    default:
                        return new Errores("Semantico", "No se puede operar entero con: " + op2, this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) > parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) > parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) > parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseFloat(op1) > 1;
                        }else{
                            return parseFloat(op1) > 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar doble con: " + op2, this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) > parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) > parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:    
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) > parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseInt(op1.charCodeAt(1)) > 1;
                        }else{
                            return parseInt(op1.charCodeAt(1)) > 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar char con: " + op2, this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == false && op2 == true ){
                            return 0 > 1;
                        }else  if(op1 == true && op2 == false ){
                            return 1 > 0;
                        }else{
                            return false
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar boolean con: " + op2, this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Operacion Relacional Invalida", this.linea, this.col)
        }
    }
    mayor_igual(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.INTEGER:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) >= parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1) >= parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        //console.log(op2.charCodeAt(1))
                        if(parseInt(op1) >= parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseInt(op1) >= 1;
                        }else{
                            return parseInt(op1) >= 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar entero con: " + op2, this.linea, this.col)
                }
            case tipoDato.DOUBLE:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) >= parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) >= parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseFloat(op1) >= parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseFloat(op1) >= 1;
                        }else{
                            return parseFloat(op1) >= 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar doble con: " + op2, this.linea, this.col)
                }
            case tipoDato.CHAR:
                switch (tipo2) {
                    case tipoDato.INTEGER:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) >= parseInt(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.DOUBLE:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) >= parseFloat(op2)){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.CHAR:    
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(parseInt(op1.charCodeAt(1)) >= parseInt(op2.charCodeAt(1))){
                            return true
                        }else{
                            return false
                        }
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op2 == true){
                            return parseInt(op1.charCodeAt(1)) >= 1;
                        }else{
                            return parseInt(op1.charCodeAt(1)) >= 0;
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar char con: " + op2, this.linea, this.col)
                }
            case tipoDato.BOOLEAN:
                switch (tipo2) {
                    case tipoDato.BOOLEAN:
                        this.tipoDato = new Tipo(tipoDato.BOOLEAN)
                        if(op1 == false && op2 == true ){
                            return 0 >= 1;
                        }else  if(op1 == true && op2 == false ){
                            return 1 >= 0;
                        }else{
                            return false
                        }
                    default:
                        return new Errores("Semantico", "No se puede operar boolean con: " + op2, this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Operacion Relacional Invalida", this.linea, this.col)
        }
    }

    ArbolGraph(anterior: string): string {
        
        let indice = Contador.getInstancia();
        let resultado =""

        if(this.operacion == Operadores.IGUALACIONDOBLE){

            let expresion1 = `n${indice.get()}`

            let expresion2 = `n${indice.get()}`
            
            
            let operando = `n${indice.get()}`

            resultado += `${expresion1}[label = "Expresion"];\n`

            resultado += `${operando}[label = "=="];\n`


            resultado += `${expresion2}[label = "Expresion"];\n`
            
            resultado += `${anterior} -> ${expresion1};\n`
            resultado += `${anterior} -> ${operando};\n`
            
            resultado += `${anterior} -> ${expresion2};\n`

            resultado += this.operando1?.ArbolGraph(expresion1)
            resultado += this.operando2?.ArbolGraph(expresion2)

        }else if(this.operacion == Operadores.DIFERENCIACION){

            let expresion1 = `n${indice.get()}`
            let expresion2 = `n${indice.get()}`
            let operando = `n${indice.get()}`

            resultado += `${expresion1}[label = "Expresion"];\n`
            resultado += `${operando}[label = "!="];\n`
            resultado += `${expresion2}[label = "Expresion"];\n`

            resultado += `${anterior} -> ${expresion1};\n`
            resultado += `${anterior} -> ${operando};\n`
            resultado += `${anterior} -> ${expresion2};\n`

            resultado += this.operando1?.ArbolGraph(expresion1)
            resultado += this.operando2?.ArbolGraph(expresion2)

        }else if(this.operacion == Operadores.MAYOR){

            let expresion1 = `n${indice.get()}`
            let expresion2 = `n${indice.get()}`
            let operando = `n${indice.get()}`

            resultado += `${expresion1}[label = "Expresion"];\n`
            resultado += `${operando}[label = ">"];\n`
            resultado += `${expresion2}[label = "Expresion"];\n`

            resultado += `${anterior} -> ${expresion1};\n`
            resultado += `${anterior} -> ${operando};\n`
            resultado += `${anterior} -> ${expresion2};\n`

            resultado += this.operando1?.ArbolGraph(expresion1)
            resultado += this.operando2?.ArbolGraph(expresion2)

        }else if(this.operacion == Operadores.MENOR){

            let expresion1 = `n${indice.get()}`
            let expresion2 = `n${indice.get()}`
            let operando = `n${indice.get()}`

            resultado += `${expresion1}[label = "Expresion"];\n`
            resultado += `${operando}[label = "<"];\n`
            resultado += `${expresion2}[label = "Expresion"];\n`

            resultado += `${anterior} -> ${expresion1};\n`
            resultado += `${anterior} -> ${operando};\n`
            resultado += `${anterior} -> ${expresion2};\n`

            resultado += this.operando1?.ArbolGraph(expresion1)
            resultado += this.operando2?.ArbolGraph(expresion2)

        }else if(this.operacion == Operadores.MAYORIGUAL){

            let expresion1 = `n${indice.get()}`
            let expresion2 = `n${indice.get()}`
            let operando = `n${indice.get()}`

            resultado += `${expresion1}[label = "Expresion"];\n`
            resultado += `${operando}[label = ">="];\n`
            resultado += `${expresion2}[label = "Expresion"];\n`

            resultado += `${anterior} -> ${expresion1};\n`
            resultado += `${anterior} -> ${operando};\n`
            resultado += `${anterior} -> ${expresion2};\n`

            resultado += this.operando1?.ArbolGraph(expresion1)
            resultado += this.operando2?.ArbolGraph(expresion2)


        }else if(this.operacion == Operadores.MENORIGUAL){

            let expresion1 = `n${indice.get()}`
            let expresion2 = `n${indice.get()}`
            let operando = `n${indice.get()}`

            resultado += `${expresion1}[label = "Expresion"];\n`
            resultado += `${operando}[label = "<="];\n`
            resultado += `${expresion2}[label = "Expresion"];\n`

            resultado += `${anterior} -> ${expresion1};\n`
            resultado += `${anterior} -> ${operando};\n`
            resultado += `${anterior} -> ${expresion2};\n`

            resultado += this.operando1?.ArbolGraph(expresion1)
            resultado += this.operando2?.ArbolGraph(expresion2)

        }

        return resultado;
    }
}

export enum Operadores {
    IGUALACIONDOBLE,
    DIFERENCIACION,
    MENOR,
    MAYOR,
    MENORIGUAL,
    MAYORIGUAL,
}