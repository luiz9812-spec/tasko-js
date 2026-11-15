const DiaDAO = require("../dao/DiaDAO");
const TarefaDAO = require("../dao/TarefaDAO");


class TarefaService {
    async validar(id_dia, id_usuario) {
        const dao = new DiaDAO();

        const dia = await dao.buscarPorId(id_dia);

        if (!dia) {
            throw new Error("Dia não encontrado");
        }

        if (dia.id_usuario !== id_usuario) {
            throw new Error ("Esse dia não pertence ao usuário");
        }

        return true;
        
    }
    
    async cadastrar(tarefa, id_usuario) {
        const dao = new TarefaDAO();
        
        await this.validar(tarefa.getId_dia(), id_usuario)

        await dao.cadastrar(tarefa);
        
    }

    async concluir(id_tarefa, id_usuario) {
        const dao = new TarefaDAO();

        return await dao.concluir(id_tarefa, id_usuario);
    }

    async buscar(id_dia, id_usuario) {
        await this.validar(id_dia, id_usuario);

        const dao = new TarefaDAO();

        return await dao.buscar(id_dia);
    }

    async deletar(id_tarefa, id_usuario) {
        const dao = new TarefaDAO();

        await dao.deletar(id_tarefa, id_usuario);
    }

    async alterar(nome, id_tarefa, id_usuario) {
        const dao = new TarefaDAO();

        if (!nome || !nome.trim()) {
            throw new Error("O nome da tarefa não pode ficar vazio.");
        }

        await dao.alterar(nome.trim(), id_tarefa, id_usuario);
    }

}
module.exports = TarefaService;