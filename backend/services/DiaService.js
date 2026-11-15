const DiaDAO = require("../dao/DiaDAO.js");
const TarefaDAO = require("../dao/TarefaDAO.js");
const Dia = require("../dados/Dia.js");
const Tarefa = require("../dados/Tarefa.js");
const GestorDeConexao = require("../dao/GestorDeConexao.js");

class DiaService {

    async validar(id_usuario, data) {
        const dao = new DiaDAO();

        const dia = await dao.buscarPorData(id_usuario, data);

        return dia || null;
        
    }

    async buscarPorId(id_dia) {
        const dao = new DiaDAO();

        const dia = await dao.buscarPorId(id_dia);

        return dia || null;
    }

    async buscarDias(id_usuario) {
        const diaDao = new DiaDAO();
        const tarefaDAO = new TarefaDAO();

        const dias = await diaDao.buscar(id_usuario);

        const diasComPrevia = await Promise.all(
            dias.map(async dia => {
                const previa = await tarefaDAO.buscarPorPrevia(dia.id_dia);
                return {
                    ...dia,
                    tarefas: previa.tarefas,
                    total_tarefas: previa.total
                };
            })
        );

        return diasComPrevia;
    }

    async validarDataDisponivel(id_usuario, data) {
        const hoje = new Date();

        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const diaAtual = String(hoje.getDate()).padStart(2, "0");

        const dataHoje = `${ano}-${mes}-${diaAtual}`;

        if (data < dataHoje) {
            throw new Error("Não é possível cadastrar um dia no passado.");
        }

        const existe = await this.validar(id_usuario, data);

        if (existe) {
            throw new Error("Dia já criado!");
        }
    }


    async cadastrar(dia) {
        await this.validarDataDisponivel(
            dia.getId_usuario(),
            dia.getData()
        );

        const dao = new DiaDAO();

        const id_dia = await dao.cadastrar(dia);

        return id_dia;
    }

    
    async clonar(id_dia, id_usuario, novaData) {
        // 1. Buscar o dia original.
        const dadosDia = await this.buscarPorId(id_dia);

        if (!dadosDia) {
            throw new Error("Dia não encontrado!");
        }

        // 2. Confirmar que pertence ao usuário.
        if (Number(dadosDia.id_usuario) !== Number(id_usuario)) {
            throw new Error("Esse dia não pertence ao usuário");
        }

        // 3. Validar a nova data.
        await this.validarDataDisponivel(id_usuario, novaData);

        // 4. Reconstruir o dia original como objeto.
        const diaOriginal = new Dia(
            dadosDia.data,
            dadosDia.id_usuario
        );

        const tarefaDAO = new TarefaDAO();
        const tarefas = await tarefaDAO.buscar(id_dia);

        for (const dadosTarefa of tarefas) {
            const tarefa = new Tarefa(dadosTarefa.id_dia, dadosTarefa.nome, dadosTarefa.pontos);

            diaOriginal.adicionarTarefa(tarefa);
        }

        // 5. Aplicar o padrão Prototype.
        const copia = diaOriginal.clonar(novaData);

        // 6. Salvar tudo na mesma transação.
        const conexao = await GestorDeConexao.getConnection();
        let transacaoIniciada = false;

        try {
            await conexao.beginTransaction();
            transacaoIniciada = true;

            const diaDAO = new DiaDAO();

            const novoIdDia = await diaDAO.cadastrar(copia, conexao);

            copia.setId_dia(novoIdDia);

            for (const tarefa of copia.getTarefas()) {
                tarefa.setId_dia(novoIdDia);

                await tarefaDAO.cadastrar(tarefa, conexao);
            }

            await conexao.commit();
            transacaoIniciada = false;

            return {
                id_dia: novoIdDia,
                data: copia.getData(),
                total_tarefas: copia.getTarefas().length
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



    async deletar(id_dia, id_usuario) {
        const diaDAO = new DiaDAO();
        const dia = await diaDAO.buscarPorId(id_dia);

        if (!dia) {
            throw new Error("Dia não encontrado");
        }

        if (dia.id_usuario !== id_usuario) {
            throw new Error("Esse dia não pertence ao usuário");
        }

        await diaDAO.deletar(id_dia, id_usuario);
    }

}

module.exports = DiaService;