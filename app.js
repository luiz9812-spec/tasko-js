const express = require("express");
const session = require("express-session");
const UsuarioService = require("./backend/services/UsuarioService.js");
const UsuarioBuilder = require("./backend/builders/UsuarioBuilder.js");
const TarefaBuilder = require("./backend/builders/TarefaBuilder.js");
const TarefaService = require("./backend/services/TarefaService.js");
const DiaService = require("./backend/services/DiaService.js");
const DiaBuilder = require("./backend/builders/DiaBuilder.js");

const app = express();
app.use(express.json());

app.use(session({secret: "1234", resave: false, saveUninitialized: false, cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

app.use(express.static("telas"));

app.post("/cadastrar", async (req, res) => {
    try {
        const { login, senha, nome } = req.body;

        const usuario = new UsuarioBuilder().Login(login).Senha(senha).Nome(nome).build();

        const service = new UsuarioService();

        await service.cadastrar(usuario);

        res.send("Usuário cadastrado com sucesso!");
    } catch (erro) {
        res.status(400).send(erro.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { login, senha} = req.body;

        const service = new UsuarioService();

        const usuario = await service.login(login, senha);

        req.session.usuario = {
            id_usuario: usuario.id_usuario,
            login: usuario.login,
            nome: usuario.nome
        };

        res.json({
            mensagem: "Login realizado com sucesso!",
            usuario: usuario
        });
    } catch(erro) {
        res.status(401).send(erro.message);
    }

});

app.get("/sessao", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).send("Nenhum usuário autenticado");
        }

        const id_usuario = req.session.usuario.id_usuario;
        const service = new UsuarioService();

        const usuario = await service.buscarPorId(id_usuario);

        if (!usuario) {
            return res.status(401).send("Usuário não encontrado");
        }

        req.session.usuario = usuario;

        res.json(usuario);
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao buscar dados do usuário");
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).json({
                mensagem: "Erro ao encerrar a sessão."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            mensagem: "Logout realizado com sucesso."
        });
    });
});

app.get("/protegida", (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).send("Você precisa fazer login");
    }

    res.send(`Olá, ${req.session.usuario.nome}! Você está autenticado!`);
})

app.get("/teste", (req, res) => {
    res.send("Servidor Funcionando!");
});

app.post("/tarefas", async (req, res) => {
    try {
        if(!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        const {id_dia, nome, pontos} = req.body;

        const tarefa = new TarefaBuilder().Id_dia(id_dia).Nome(nome).Pontos(pontos).build();

        const id_usuario = req.session.usuario.id_usuario;

        const service = new TarefaService();
        await service.cadastrar(tarefa, id_usuario);

        res.status(201).send("Tarefa cadastrada com sucesso!");
    } catch (erro) {
        res.status(400).send(erro.message);
    }
});

app.delete("/tarefas/:id", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        const id_tarefa = Number(req.params.id);

        if (!Number.isInteger(id_tarefa) || id_tarefa <= 0) {
            return res.status(400).send("ID da tarefa inválido");
        }

        const id_usuario = req.session.usuario.id_usuario;

        const service = new TarefaService();
        await service.deletar(id_tarefa, id_usuario);

        res.status(200).send("Tarefa excluída com sucesso!");
    } catch (erro) {
        if (erro.message === "Tarefa não encontrada ou não pertence ao usuário") {
            return res.status(404).send(erro.message);
        }

        console.error(erro);
        res.status(500).send("Erro interno ao excluir a tarefa");
    }
});

app.patch("/tarefas/:id", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        const id_tarefa = Number(req.params.id);

        if (!Number.isInteger(id_tarefa) || id_tarefa <= 0) {
            return res.status(400).send("ID da tarefa inválido");
        }

        const { nome } = req.body;
        const id_usuario = req.session.usuario.id_usuario;

        const service = new TarefaService();
        await service.alterar(nome, id_tarefa, id_usuario);

        res.status(200).send("Tarefa alterada com sucesso!");
    } catch (erro) {
        if (erro.message === "O nome da tarefa não pode ficar vazio.") {
            return res.status(400).send(erro.message);
        }

        if (
            erro.message === "Tarefa não encontrada, já concluída ou não pertence ao usuário."
        ) {
            return res.status(400).send(erro.message);
        }

        console.error(erro);
        res.status(500).send("Erro interno ao alterar a tarefa");
    }
});

app.patch("/tarefas/:id/concluir", async (req, res) => {
    try {
        if(!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        const id_tarefa = Number(req.params.id);

        if (!Number.isInteger(id_tarefa) || id_tarefa <= 0) {
            return res.status(400).send("ID da tarefa inválido");
        }

        const id_usuario = req.session.usuario.id_usuario;

        const service = new TarefaService();
        const resultado = await service.concluir(id_tarefa, id_usuario);

        res.status(200).json(resultado);
    } catch (erro) {
        if (erro.message === "Tarefa não encontrada ou não pertence ao usuário" || erro.message === "Essa tarefa já foi concluída") {
            return res.status(400).send(erro.message);
        }

        console.log(erro);
        res.status(500).send("Erro interno ao concluir a tarefa");

    }
});

app.get("/dias/:id_dia/tarefas", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        const id_dia = Number(req.params.id_dia);

        if (!Number.isInteger(id_dia) || id_dia <= 0) {
            return res.status(400).send("ID do dia inválido");
        }

        const id_usuario = req.session.usuario.id_usuario;

        const service = new TarefaService();
        const tarefas = await service.buscar(id_dia, id_usuario);

        res.status(200).json(tarefas);
    } catch (erro) {
        if (erro.message === "Dia não encontrado" || erro.message === "Esse dia não pertence ao usuário") {
            return res.status(400).send(erro.message);
        }

        console.error(erro);
        res.status(500).send("Erro interno ao buscar tarefas");

    }
});

app.get("/dias", async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).send("Você precisa fazer login");
    }

    try {
        const id_usuario = req.session.usuario.id_usuario;

        const service = new DiaService();
        const dias = await service.buscarDias(id_usuario);

        res.status(200).json(dias);
    } catch (erro) {
        console.error(erro);
        res.status(500).send("Erro interno ao buscar dias");
    }

})

app.get('/dias/:id_dia', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).send('Usuário não autenticado');
    }

    try {
        const id_dia = req.params.id_dia;
        const id_usuario = req.session.usuario.id_usuario;

        const diaService = new DiaService();
        const dia = await diaService.buscarPorId(id_dia);

        if (!dia) {
            return res.status(404).send('Dia não encontrado');
        }

        if (dia.id_usuario !== id_usuario) {
            return res.status(403).send('Você não tem acesso a este dia');
        }

        res.json(dia);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar dia');
    }
});

app.post("/dias", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        const {data} = req.body;
        const id_usuario = req.session.usuario.id_usuario;

        const dia = new DiaBuilder().Id_usuario(id_usuario).Data(data).build();

        const service = new DiaService();
        const id_dia = await service.cadastrar(dia);

        res.status(201).json({
            mensagem: "Dia cadastrado com sucesso!",
            id_dia: id_dia
        });

    } catch (erro) {
        
        if (erro.message === "Não é possível cadastrar um dia no passado.") {
            return res.status(400).json({
                mensagem: erro.message
            });
        }


        if (erro.message === "Dia já criado!" || erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: erro.message
            });
        }

        console.log(erro);
        res.status(500).send("Erro interno ao cadastrar dia");
    }
});

app.delete("/dias/:id_dia", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        const id_dia = Number(req.params.id_dia);

        if (!Number.isInteger(id_dia) || id_dia <= 0) {
            return res.status(400).send("ID do dia inválido");
        }

        const id_usuario = req.session.usuario.id_usuario;
        const service = new DiaService();

        await service.deletar(id_dia, id_usuario);

        res.status(200).send("Dia excluído com sucesso!");
    } catch (erro) {
        if (erro.message === "Dia não encontrado") {
            return res.status(404).send(erro.message);
        }

        if (erro.message === "Esse dia não pertence ao usuário") {
            return res.status(403).send(erro.message);
        }

        console.error(erro);
        res.status(500).send("Erro interno ao excluir o dia");
    }
});


app.post("/dias/:id_dia/clonar", async (req, res) => {
    try {
        // 1. Verificar se o usuário está autenticado.
        if (!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        // 2. Obter e validar o ID do dia original.
        const id_dia = Number(req.params.id_dia);

        if (!Number.isInteger(id_dia) || id_dia <= 0) {
            return res.status(400).send("ID do dia inválido");
        }

        // 3. Receber a nova data.
        const { novaData } = req.body;

        if (!novaData) {
            return res.status(400).send("Informe a nova data");
        }

        // O usuário vem da sessão, nunca do corpo da requisição.
        const id_usuario = req.session.usuario.id_usuario;

        // 4. Solicitar a clonagem ao Service.
        const service = new DiaService();

        const resultado = await service.clonar(
            id_dia,
            id_usuario,
            novaData
        );

        // 5. Retornar o resultado.
        return res.status(201).json({
            mensagem: "Dia clonado com sucesso!",
            ...resultado
        });

    } catch (erro) {
        if (erro.message === "Dia não encontrado!") {
            return res.status(404).send(erro.message);
        }

        if (erro.message === "Esse dia não pertence ao usuário") {
            return res.status(403).send(erro.message);
        }

        if (erro.message === "Não é possível cadastrar um dia no passado.") {
            return res.status(400).send(erro.message);
        }

        if (erro.message === "Dia já criado!" || erro.code === "ER_DUP_ENTRY") {
            return res.status(409).send(erro.message);
        }

        console.error("Erro ao clonar dia:", erro);
        return res.status(500).send("Erro interno ao clonar o dia");
    }
});


app.get("/usuario", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({
                mensagem: "Você precisa fazer login"
            });
        }

        const id_usuario = req.session.usuario.id_usuario;

        const service = new UsuarioService();

        const usuario = await service.buscarPorId(id_usuario);

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuario não encontrado"
            });
        }

        res.json(usuario);

    } catch (erro) {
        console.log(erro);
        res.status(500).json({
            mensagem: "Erro interno ao buscar usuário"
        });
    }
});

app.get("/rank", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).send("Você precisa fazer login");
        }

        const service = new UsuarioService();
        const ranking = await service.buscarRanking();

        res.status(200).json(ranking);
    } catch (erro) {
        console.error(erro);
        res.status(500).send("Erro interno ao buscar ranking");
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
