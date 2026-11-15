/*
Cria o banco, se o banco já existe, não cria.
Seleciona o tasko como banco a ser usado.
*/
CREATE DATABASE IF NOT EXISTS tasko;
USE tasko;

/*
Cria a tabela de usuario, cada usuário vai ter
id: Para ser encontrado no sistema.
login: Nome que ele usará para entrar no sistema.
senha: Senha para ser usada para logar no sistema, vai ser salva em hash para mais segurança.
nome: Nome ou apelido que o usuário vai usar no programa e para ser mostrado no ranking.
pontos: Quantidade de pontos que o usuário tem no momento.
*/
CREATE TABLE usuario (
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
login VARCHAR(100) NOT NULL UNIQUE,
senha VARCHAR(255) NOT NULL,
nome VARCHAR(255) NOT NULL,
pontos INT DEFAULT 0
);

/*
Cria a tabela de dia, nela vai ter:
id: id do dia, para controle.
id_usuario: O id do usuário que está criando esse dia.
data: data do dia criado.
constraint: O id_usuario e data tem que ser unique. O usuario 10 não poderá cadastrar o dia 19-09-2026 duas vezes
*/

CREATE TABLE dia (
id_dia INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
data DATE NOT NULL,
CONSTRAINT uq_dia_usuario_data UNIQUE (id_usuario, data), 
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

/*
Cria a tabela de tarefas, nela vai ter:
id: id da tarefa, para controle.
id_dia: O id do dia que vai ser atribuido essa tarefa.
nome: Nome da tarefa.
pontos: Quantos pontos essa tarefa vale
concluida: se estiver False ela não foi, se estiver true ela foi.
*/
CREATE TABLE tarefa (
id_tarefa INT AUTO_INCREMENT PRIMARY KEY,
id_dia INT NOT NULL,
nome VARCHAR(255) NOT NULL,
pontos INT NOT NULL DEFAULT 0,
concluida BOOLEAN NOT NULL DEFAULT FALSE,
FOREIGN KEY (id_dia) REFERENCES dia(id_dia) ON DELETE CASCADE
);
