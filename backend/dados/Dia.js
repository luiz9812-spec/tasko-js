const Tarefa = require('./Tarefa.js');

class Dia {
    #id_dia;
    #id_usuario;
    #data;
    #tarefas;

    constructor(data, id_usuario) {
        this.#data = data;
        this.#id_usuario = id_usuario;
        this.#tarefas = [];
    }

    getId_dia() {
        return this.#id_dia;
    }

    setId_dia(id_dia) {
        this.#id_dia = id_dia;
    }

    getId_usuario() {
        return this.#id_usuario;
    }

    setId_usuario(id_usuario) {
        this.#id_usuario = id_usuario;
    }

    getTarefas() {
        return this.#tarefas;
    }

    adicionarTarefa(tarefa) {
        this.#tarefas.push(tarefa);
    }

    getData() {
        return this.#data
    }

    setData(data) {
        this.#data = data;
    }

    clonar(novaData) {
        const copia = new Dia(novaData, this.#id_usuario);

        for (const tarefa of this.#tarefas) {
            const tarefaClonada = new Tarefa(null, tarefa.getNome(), tarefa.getPontos());

        copia.adicionarTarefa(tarefaClonada);
        }

        return copia;
    }
}
module.exports = Dia;