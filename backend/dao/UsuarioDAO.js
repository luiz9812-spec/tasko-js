const GestorDeConexao = require("./GestorDeConexao.js");

class UsuarioDAO {
    async cadastrar(usuario) {
        const sql = `INSERT INTO usuario (login, senha, nome) VALUES (?, ?, ?)`;

        const conexao = await GestorDeConexao.getConnection();

        try {
            await conexao.execute(sql, [
                usuario.getLogin(),
                usuario.getSenha(),
                usuario.getNome()
            ]);
        } finally {
            await conexao.end();
        }
    }

    async buscar(login) { 
        const sql = `SELECT * FROM usuario WHERE login = ?`;

        const conexao = await GestorDeConexao.getConnection();

        try{
            const [resultado] = await conexao.execute(sql, [login]);
            return resultado[0];
        } finally {
            await conexao.end();
        }
    }

    async buscarPorId(id_usuario) {
        const sql = `SELECT id_usuario, login, nome, pontos FROM usuario WHERE id_usuario = ?`;

        const conexao = await GestorDeConexao.getConnection();

        try {
            const [resultado] = await conexao.execute(sql, [id_usuario]);
            return resultado[0];
        } finally {
            await conexao.end();
        }
    }

    async buscarRanking() {
        const sql = `SELECT id_usuario, nome, pontos FROM usuario ORDER BY pontos DESC, nome ASC`;

        const conexao = await GestorDeConexao.getConnection();

        try {
            const [resultado] = await conexao.execute(sql);
            return resultado;
        } finally {
            await conexao.end();
        }
    }
}

module.exports = UsuarioDAO;