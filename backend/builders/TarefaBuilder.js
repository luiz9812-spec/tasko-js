const Tarefa = require('../dados/Tarefa.js')
class TarefaBuilder {
    #id_tarefa;
    #id_dia;
    #nome;
    #pontos;

    // Metodos que recebem os dados
    Id_tarefa(id_tarefa) {
        this.#id_tarefa = id_tarefa;
        return this;
    }

    Id_dia(id_dia) {
        this.#id_dia = id_dia;
        return this;
    }

    Nome(nome) {
        this.#nome = nome;
        return this;
    }

    Pontos(pontos) {
        this.#pontos = pontos;
        return this;
    }

    // Metodo que constroi a classe Tarefa
    build() {
        if (this.#nome == null || this.#id_dia == null || this.#pontos == null) {
            throw new Error ("Nome, Dia e Pontos são obrigatórios");
        }
        return new Tarefa(this.#id_dia, this.#nome, this.#pontos);
    }
}

module.exports = TarefaBuilder;