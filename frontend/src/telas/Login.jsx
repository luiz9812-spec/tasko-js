import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import '../estilos/Autenticacao.css';
import CampoFormulario from '../componentes/CampoFormulario.jsx';

function Login() {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const navegar = useNavigate();
    const localizacao = useLocation();
    const [mensagem, setMensagem] = useState(localizacao.state?.mensagem || '');

    async function verificar(evento) {
        evento.preventDefault();
        setMensagem('');

        try {
            const resposta = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: login,
                    senha: senha
                }),
                credentials: "include"
            });

            const texto = await resposta.text();

            if (resposta.ok) {
                //console.log("Login realizado!", dados);
                navegar('/principal');
            } else {
                setMensagem(texto || 'Usuário ou senha incorretos');
                //const mensagem = await resposta.text();
                //console.log("Erro no login: ", mensagem);
            }
        } catch (erro) {
            console.error("Não foi possível conectar ao servidor:", erro);
        }

        //console.log("Login: ", login);
        //console.log("Senha:", senha);
    }

    useEffect(() => {
        if (!localizacao.state?.mensagem) return;

        navegar(localizacao.pathname, {
            replace: true,
            state: null
        });
    }, [localizacao.pathname, localizacao.state, navegar]);

    useEffect(() => {
        if (!mensagem) return;

        const timer = setTimeout(() => {
            setMensagem('');
        }, 2000);

        return () => clearTimeout(timer);
    }, [mensagem]);

    
    return (
        <main className="tela-autenticacao tela-login">
            <section className="painel-autenticacao">
                <h1 className="titulo-tasko">TASKO</h1>
                <h2 className="titulo-formulario">Login</h2>

                <form className="formulario-autenticacao" onSubmit={verificar}>
                    <CampoFormulario id="login" label="Login" valor={login} aoAlterar={(evento) => setLogin(evento.target.value)}/>

                    <CampoFormulario id="senha" label="Senha" tipo="password" valor={senha} aoAlterar={(evento) => setSenha(evento.target.value)}/>

                    <button className="botao-principal" type="submit">Entrar</button>

                    <button className="botao-secundario" type="button" onClick={() => navegar('/cadastro')}>Cadastrar</button>
                </form>

                {mensagem && <p className="mensagem-autenticacao" role="status">{mensagem}</p>}
            </section>
        </main>
    );

}

export default Login;