import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/Autenticacao.css';
import CampoFormulario from '../componentes/CampoFormulario.jsx';

function Cadastro() {
    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const navegar = useNavigate();

    async function cadastrar(evento) {
        evento.preventDefault();

        try {
            const resposta = await fetch('/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    login: login,
                    senha: senha
                })
            });
            const texto = await resposta.text();
            if (resposta.ok) {
                navegar('/', {
                    state: {
                        mensagem: 'Cadastro realizado com sucesso!'
                    }
                });
            } else if(texto.includes('Duplicate entry')) {
                setMensagem('Esse login já está sendo utilizado.');
            } else {
                setMensagem(texto || 'Não foi possível realizar o cadastro');
            }
        } catch (erro) {
            setMensagem('Não foi possível conectar ao servidor.');
            console.error('Erro ao cadastrar:', erro);
        }
    }


    return (
        <main className="tela-autenticacao tela-cadastro">
            <section className="painel-autenticacao">
                <h1 className="titulo-tasko">TASKO</h1>
                <h2 className="titulo-formulario">Cadastro</h2>

                <form className="formulario-autenticacao" onSubmit={cadastrar}>
                    <CampoFormulario id="nome" label="Nome" valor={nome} aoAlterar={(evento) => setNome(evento.target.value)}/>

                    <CampoFormulario id="login" label="Login" valor={login} aoAlterar={(evento) => setLogin(evento.target.value)}/>

                    <CampoFormulario id="senha" label="Senha" tipo="password" valor={senha} aoAlterar={(evento) => setSenha(evento.target.value)}/>

                    <button className="botao-principal" type="submit">Cadastrar</button>

                    <button className="botao-secundario" type="button" onClick={() => navegar('/')}>Voltar ao login</button>
                </form>

                {mensagem && <p className="mensagem-autenticacao" role="status">{mensagem}</p>}
            </section>
        </main>
    );

}
export default Cadastro;