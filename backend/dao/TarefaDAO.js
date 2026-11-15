const GestorDeConexao = require("./GestorDeConexao.js");

class TarefaDAO {
    
    async cadastrar(tarefa, conexaoExistente = null) {
        const sql = `INSERT INTO tarefa (id_dia, nome, pontos) VALUES (?, ?, ?)`;

        const conexao = conexaoExistente || await GestorDeConexao.getConnection();

        try {   
            const [resultado] = await conexao.execute(sql, [tarefa.getId_dia(), tarefa.getNome(), tarefa.getPontos()]);

            return resultado.insertId;
        } finally {
            if (!conexaoExistente) {
                await conexao.end();
            }
        }
    }


    async buscar(id_dia) {
        const sql = `SELECT * FROM tarefa WHERE id_dia = ?`;

        const conexao = await GestorDeConexao.getConnection();

        try{
            const [resultado] = await conexao.execute(sql, [id_dia]);
            return resultado;
        } finally {
            await conexao.end();
        }
    }

    async buscarPorPrevia(id_dia) {
        const sqlBusca = `SELECT * FROM tarefa WHERE id_dia = ? ORDER BY id_tarefa LIMIT 3`;

        const sqlCount = `SELECT COUNT(*) AS total FROM tarefa WHERE id_dia = ?`

        const conexao = await GestorDeConexao.getConnection();

        try{
            const [tarefas] = await conexao.execute(sqlBusca, [id_dia]);
            const [resultadoCount] = await conexao.execute(sqlCount, [id_dia]);
            return {
                tarefas: tarefas,
                total: resultadoCount[0].total
            };
        } finally {
            await conexao.end();
        }
    }

    async deletar(id_tarefa, id_usuario) {
        const sql = `DELETE t FROM tarefa t INNER JOIN dia d ON t.id_dia = d.id_dia WHERE t.id_tarefa = ? AND d.id_usuario = ?`;

        const conexao = await GestorDeConexao.getConnection();

        try{
            const [resultado] = await conexao.execute(sql, [id_tarefa, id_usuario]);
            if (resultado.affectedRows === 0) {
                throw new Error("Tarefa não encontrada ou não pertence ao usuário");
            }
        } finally {
            await conexao.end();
        }
    }

    async alterar(nome, id_tarefa, id_usuario) {
        const sql = `UPDATE tarefa t INNER JOIN dia d ON t.id_dia = d.id_dia SET t.nome = ? WHERE t.id_tarefa = ? AND d.id_usuario = ? AND t.concluida = FALSE`;

        const conexao = await GestorDeConexao.getConnection();

        try {
            const [resultado] = await conexao.execute(sql, [
                nome,
                id_tarefa,
                id_usuario
            ]);

            if (resultado.affectedRows === 0) {
                throw new Error(
                    "Tarefa não encontrada, já concluída ou não pertence ao usuário."
                );
            }
        } finally {
            await conexao.end();
        }
}

    async concluir(id_tarefa, id_usuario) {
        const conexao = await GestorDeConexao.getConnection();

        let transacaoIniciada = false;

        try {
            await conexao.beginTransaction();
            transacaoIniciada = true;

            const sqlBusca = `SELECT t.pontos, t.concluida FROM tarefa t INNER JOIN dia d ON t.id_dia = d.id_dia WHERE t.id_tarefa = ? AND d.id_usuario = ? FOR UPDATE`;

            const [resultado] = await conexao.execute(sqlBusca, [id_tarefa, id_usuario]);

            if (resultado.length === 0) {
                throw new Error("Tarefa não encontrada ou não pertence ao usuário");
            }

            const tarefa = resultado[0];

            if (tarefa.concluida) {
                throw new Error("Essa tarefa já foi concluída");
            }

            const sqlConcluir = `UPDATE tarefa SET concluida = TRUE WHERE id_tarefa = ?`;

            await conexao.execute(sqlConcluir, [id_tarefa]);

            const sqlPontos = `UPDATE usuario SET pontos = pontos + ? WHERE id_usuario = ?`;

            await conexao.execute(sqlPontos, [tarefa.pontos, id_usuario]);

            await conexao.commit();
            transacaoIniciada = false;

            return {
                mensagem: "Tarefa concluída com sucesso!",
                pontosAdicionados: tarefa.pontos
            };
        } catch (erro) {
            if (transacaoIniciada) {
                await conexao.rollback();
            }

            throw erro;
        } finally {
            await conexao.end();
        }

    }

}

module.exports = TarefaDAO;