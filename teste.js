const UsuarioBuilder = require("./backend/builders/UsuarioBuilder");
const UsuarioService = require("./backend/services/UsuarioService");
const TarefaBuilder = require("./backend/builders/TarefaBuilder");
const TarefaDAO = require("./backend/dao/TarefaDAO");
const DiaBuilder = require("./backend/builders/DiaBuilder");
const DiaDAO = require("./backend/dao/DiaDAO");
const TarefaService = require("./backend/services/TarefaService");
const Dia = require("./backend/dados/Dia");
const Tarefa = require("./backend/dados/Tarefa");

async function teste() {

    // criar Usuario pelo Builder
    //const usuario = new UsuarioBuilder().Login('Pedro').Senha('1234').Nome('Pedro').build();

    // criar UsuarioDAO
    //const cadastrar = new UsuarioService();

    // cadastrar no banco
    // await cadastrar.cadastrar(usuario);

    // console.log("Usuário cadastrado!");

    // testar login
    //try {
    //console.log(await cadastrar.login("Pedro", "1234"));
    //} catch (erro) {
    //    console.log(erro.message);
    //}
    //try {
    //console.log(await cadastrar.login("Juca", "1234"));
    //} catch (erro) {
    //    console.log(erro.message);
    //}
    //try {
    //console.log(await cadastrar.login("Pedro", "4321"));
    //} catch (erro) {
    //    console.log(erro.message);
    //}
    
    //    const tarefa = new TarefaBuilder().Id_usuario(1).Nome("Estudar").Pontos(5).build();

    //    const dao = new TarefaDAO();
    //    await dao.cadastrar(tarefa);
    //    console.log("Tarefa cadastrada!");
    //    const tarefas = await dao.buscar(1);
    //    console.log(tarefas);
    
    //const dia = new DiaBuilder().Id_usuario(2).Data("2026-10-01").build();

    //const dao = new DiaDAO();
    //await dao.cadastrar(dia);
    //console.log("Dia Cadastrado!");
    //const dias = await dao.buscar(1);
    //console.log(dias);

    //const tarefa1 = new TarefaBuilder().Id_dia(1).Nome("Estudar JavaScript").Pontos(10).build();

    //const tarefa2 = new TarefaBuilder().Id_dia(1).Nome("Fazer exercícios").Pontos(5).build();

    //const dao = new TarefaDAO();
    //await dao.cadastrar(tarefa1);
    //console.log("Tarefa 1 Cadastrada");
    //await dao.cadastrar(tarefa2);
    //console.log("Tarefa 2 Cadastrada");
    //const t1 = await dao.buscar(1);
    //console.log(t1);
    //const t2 = await dao.buscar(2);
    //console.log(t2);

    
    //const service = new TarefaService();

    //try {
    //    await service.validar(1, 2);
    //    console.log("Validação aprovada!");
    //} catch (erro) {
    //    console.log(erro.message);
    //}

    //const tarefa = new TarefaBuilder().Id_dia(1).Nome("Estudar Algoritmos").Pontos(10).build();
    //const service = new TarefaService();

    //try {
    //    await service.cadastrar(tarefa, 2);
    //    console.log("Tarefa cadastrada!");
    //} catch(erro) {
    //    console.log(erro.message);
    //}

    // Criar o dia original
    //const diaOriginal = new Dia('2026-10-29', 4);

    // Adicionar tarefas ao dia
    //const tarefa1 = new Tarefa(null, 'Estudar JavaScript', 10);
    //const tarefa2 = new Tarefa(null, 'Fazer exercícios', 5);

    //diaOriginal.adicionarTarefa(tarefa1);
    //diaOriginal.adicionarTarefa(tarefa2);

    // Clonar o dia com uma nova data
    //const diaClonado = diaOriginal.clonar('2026-10-30');

    // Exibir os resultados
    //console.log('Data original:', diaOriginal.getData());
    //console.log('Data clonada:', diaClonado.getData());

    //console.log('Quantidade de tarefas originais:', diaOriginal.getTarefas().length);
    //console.log('Quantidade de tarefas clonadas:', diaClonado.getTarefas().length);
    
    //console.log('Os dias são objetos diferentes?', diaOriginal !== diaClonado);

    //console.log('As listas de tarefas são diferentes?', diaOriginal.getTarefas() !== diaClonado.getTarefas());

    //console.log('A primeira tarefa é um objeto diferente?', diaOriginal.getTarefas()[0] !== diaClonado.getTarefas()[0]);

    const DiaService = require('./backend/services/DiaService.js');

    async function testarClonagem() {
        const service = new DiaService();

        try {
            const resultado = await service.clonar(
                7,              // ID do dia original
                4,              // ID do usuário dono do dia
                '2026-10-30'    // Nova data
            );

            console.log('Dia clonado e salvo com sucesso!');
            console.log(resultado);

        } catch (erro) {
            console.error('Erro ao clonar o dia:', erro.message);
        }
    }

    testarClonagem();

}

teste();

