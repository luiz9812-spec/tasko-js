class Tarefa {
    // Atributos
    #id_tarefa;
    #id_dia;
    #nome;
    #pontos;

    // Construtor
    constructor (d, n, p) {
        this.#id_dia = d;
        this.#nome = n;
        this.#pontos = p;
    }

    // Metodo Getter e Setters
    getId_tarefa() {
        return this.#id_tarefa;
    }

    setId_tarefa(id_tarefa) {
        this.#id_tarefa = id_tarefa;
    }

    getId_dia() {
        return this.#id_dia;
    }

    setId_dia(id_dia) {
        this.#id_dia = id_dia;
    }

    getNome() {
        return this.#nome;
    }

    setNome(nome) {
        this.#nome = nome;
    }

    getPontos() {
        return this.#pontos;
    }

    setPontos(pontos) {
        this.#pontos = pontos;
    }
}
module.exports = Tarefa;