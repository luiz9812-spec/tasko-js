import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../estilos/Ranking.css';
import Cabecalho from '../componentes/Cabecalho.jsx';
import Rodape from '../componentes/Rodape.jsx';
import calcularNivel from "../utilitarios/calcularNivel.js";

function Ranking() {
    const [usuario, setUsuario] = useState(null);
    const [ranking, setRanking] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const navegar = useNavigate();

    useEffect(() => {
        async function carregarDados() {
            try {
                const respostaSessao = await fetch("/sessao", {
                    credentials: "include"
                });

                if (!respostaSessao.ok) {
                    navegar("/");
                    return;
                }

                const dadosUsuario = await respostaSessao.json();
                setUsuario(dadosUsuario);

                const respostaRanking = await fetch("/rank", {
                    credentials: "include"
                });

                if (respostaRanking.status === 401) {
                    navegar("/", { replace: true });
                    return;
                }

                if (!respostaRanking.ok) {
                    throw new Error("Erro ao carregar o ranking");
                }

                const dadosRanking = await respostaRanking.json();
                setRanking(dadosRanking);

            } catch (erro) {
                console.error(erro);
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [navegar]);

    if (carregando) {
        return <p>Carregando ranking...</p>;
    }

    if (!usuario) {
        return null;
    }

    return (
        <main className="ranking">
            <Cabecalho usuario={usuario}/>
            <section className="conteudo-ranking">
                <div className="titulo-ranking">
                    <h2>CLASSIFICAÇÃO DE USUÁRIOS</h2>
                    <p>Seu XP: {usuario.pontos ?? 0}</p>
                </div>
                <div className="lista-ranking">
                    {ranking.map((item) => (
                        <div className="item-ranking" key={item.id_usuario}>
                            <p className={`nome-ranking ${item.posicao <= 3 ? `top-${item.posicao}` : ''}`}><span>{item.posicao}º</span> {item.nome}</p> <p className="nivel-ranking">Nível {calcularNivel(item.pontos)}</p> <p className="xp-ranking">XP: {item.pontos}</p>
                        </div>
                    ))}
                </div>
            </section>
            <Rodape paginaAtiva="ranking"/>
        </main>
    );
}

export default Ranking;