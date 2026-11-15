import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/Perfil.css';
import Cabecalho from '../componentes/Cabecalho.jsx';
import Rodape from '../componentes/Rodape.jsx';
import calcularNivel from "../utilitarios/calcularNivel.js";

function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregado] = useState(true);
    const navegar = useNavigate();

    useEffect(() => {
        async function verificarSessao() {
            try {
                const resposta = await fetch('/sessao', {
                    credentials: 'include'
                });
                if (!resposta.ok) {
                    navegar('/', {replace: true});
                    return;
                }
                const dados = await resposta.json();
                setUsuario(dados);
            } catch (erro) {
                console.error('Erro ao verificar sessão: ', erro);
                navegar('/', {replace: true});
            } finally {
                setCarregado(false);
            }
        }
        verificarSessao();
    }, [navegar]);

    async function sair() {
        const resposta = await fetch("/logout", {
            method: "POST",
            credentials: "include"
        });

        if (resposta.ok) {
            navegar("/");
        }
    }

    if (carregando) {
        return <p>Verificando sessão...</p>;
    }

    if (!usuario) {
        return null;
    }

    const nivel = calcularNivel(usuario.pontos);

    return (
        <main className="perfil">
            <Cabecalho usuario={usuario} />
            <section className="conteudo-perfil">
                <h2>Olá, {usuario.nome}</h2>
                <div className="estatisticas-perfil">
                    <p>XP TOTAL: {usuario.pontos ?? 0}</p>
                    <p>Nível: {nivel}</p>
                </div>
                <button type="button" className="botao-sair" onClick={sair}>Sair da conta</button>
            </section>
            <Rodape paginaAtiva="perfil" />
        </main>
    );
}

export default Perfil;