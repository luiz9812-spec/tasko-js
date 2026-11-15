const GestorDeConexao = require("./GestorDeConexao.js");

class DiaDAO {

    async cadastrar(dia, conexaoExistente = null) {
        const sql = `INSERT INTO dia (id_usuario, data) VALUES (?, ?)`;

        const conexao = conexaoExistente || await GestorDeConexao.getConnection();

        try {
            const [resultado] = await conexao.execute(sql, [ dia.getId_usuario(), dia.getData()]);

            return resultado.insertId;
            
        } finally {
            if (!conexaoExistente) {
                await conexao.end();
            }
        }
    }


    async buscar(id_usuario) {
        const sql = `SELECT id_dia, id_usuario, DATE_FORMAT(data, '%Y-%m-%d') AS data FROM dia WHERE id_usuario = ? ORDER BY data`;

        const conexao = await GestorDeConexao.getConnection();

        try {
            const [resultado] = await conexao.execute(sql, [id_usuario]);
            return resultado;
        } finally {
            await conexao.end();
        }
    }

    async buscarPorId(id_dia) {
        const sql = `SELECT id_dia, id_usuario, DATE_FORMAT(data, '%Y-%m-%d') AS data FROM dia WHERE id_dia = ?`;

        const conexao = await GestorDeConexao.getConnection();

        try {
            const [resultado] = await conexao.execute(sql, [id_dia]);
            return resultado[0];
        } finally {
            await conexao.end();
        }
    }

    async buscarPorData(id_usuario, data) {
        const sql = `SELECT * FROM dia WHERE id_usuario = ? AND data = ?`;

        const conexao = await GestorDeConexao.getConnection();

        try {
            const [resultado] = await conexao.execute(sql, [id_usuario, data]);
            return resultado[0];
        } finally {
            await conexao.end();
        }
    }

    async deletar(id_dia, id_usuario) {
        const sql = `DELETE FROM dia WHERE id_dia = ? AND id_usuario = ?`;

        const conexao = await GestorDeConexao.getConnection();

        try {
            const [resultado] = await conexao.execute(sql, [id_dia, id_usuario]);

            if (resultado.affectedRows === 0) {
            throw new Error("Dia não encontrado ou não pertence ao usuário");
            }
        } finally {
            await conexao.end();
        }
    }


}
module.exports = DiaDAO;