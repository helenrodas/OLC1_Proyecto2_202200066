import Simbolo from "./Simbolo";
import Tipo, { tipoDato } from './Tipo'

export default class tablaSimbolo {
    private tablaAnterior: tablaSimbolo | any
    private tablaActual: Map<string, Simbolo>
    private nombre: string

    constructor(anterior?: tablaSimbolo) {
        this.tablaAnterior = anterior
        this.tablaActual = new Map<string, Simbolo>()
        this.nombre = ""
    }

    public getAnterior(): tablaSimbolo {
        return this.tablaAnterior
    }

    public setAnterior(anterior: tablaSimbolo): void {
        this.tablaAnterior = anterior
    }

    public getTabla(): Map<String, Simbolo> {
        return this.tablaActual;
    }

    public setTabla(tabla: Map<string, Simbolo>) {
        this.tablaActual = tabla
    }

    public getVariable(id: string) {
        for (let i: tablaSimbolo = this; i != null; i = i.getAnterior()) {
            let busqueda: Simbolo = <Simbolo>i.getTabla().get(id.toLocaleLowerCase())
            if (busqueda != null) return busqueda
        }
        return null
    }

    public setVariable(simbolo: Simbolo) {
        let busqueda: Simbolo = <Simbolo>this.getTabla().get(simbolo.getId().toLocaleLowerCase())
        if (busqueda == null) {
            this.tablaActual.set(simbolo.getId().toLocaleLowerCase(), simbolo)
            return true
        }
        return false
    }

    public getNombre(): string {
        return this.nombre
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre
    }
}