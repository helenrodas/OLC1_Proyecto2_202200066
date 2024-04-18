export default class Errores {
    private tipoError: string
    private desc: string
    private fila: number
    private col: number

    constructor(tipo: string, desc: string, fila: number, col: number) {
        this.tipoError = tipo
        this.desc = desc
        this.fila = fila
        this.col = col
    }

    // Métodos get
    getTipoError(): string {
        return this.tipoError;
    }

    getDesc(): string {
        return this.desc;
    }

    getFila(): number {
        return this.fila;
    }

    getCol(): number {
        return this.col;
    }

    // Métodos set
    setTipoError(tipoError: string): void {
        this.tipoError = tipoError;
    }

    setDesc(desc: string): void {
        this.desc = desc;
    }

    setFila(fila: number): void {
        this.fila = fila;
    }

    setCol(col: number): void {
        this.col = col;
    }
}
