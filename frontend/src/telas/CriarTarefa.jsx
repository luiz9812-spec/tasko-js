import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import '../estilos/CriarTarefa.css';
import Popup from '../componentes/Popup.jsx';

function CriarTarefa() {
    const navegar = useNavigate();
    const [parametros] = useSearchParams();
    const [mensagemPopup, setMensagemPopup] = useState('');

    const idDia = parametros.get('id');

    const [nome, setNome] = useState('');
    const [pontos, setPontos] = useState(5);

    const pontuacoes = [5, 10, 20, 30, 50];

    async function cadastrarTarefa(evento) {
        evento.preventDefault();

        if (!nome.trim()) {
            setMensagemPopup('Digite o nome da tarefa!');
            return;
        }

        try {
            const resposta = await fetch('/tarefas', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    id_dia: Number(idDia),
                    nome: nome.trim(),
                    pontos: pontos
                })
            });

            const mensagem = await resposta.text();

            if (!resposta.ok) {
                throw new Error(mensagem);
            }

            //alert('Tarefa cadastrada com sucesso!');
            setMensagemPopup('Tarefa cadastrada com sucesso!');
        } catch (erro) {
            setMensagemPopup(erro.message || 'Não foi possível cadastrar a tarefa.');
        }
    }

    return (
        <main className="tela-criar-tarefa">
            <header className="cabecalho-criar-tarefa">
                <button type="button" onClick={() => navegar(-1)}>←</button>
                <h1>Tarefa</h1>
            </header>

            <form onSubmit={cadastrarTarefa}>
                <input type="text" placeholder="Digite sua tarefa" value={nome} onChange={(evento) => setNome(evento.target.value)}/>
                <h2>Quantos pontos valem?</h2>
                <div className="opcoes-pontos">{pontuacoes.map((valor) => (
                    <button key={valor} type="button" className={pontos === valor ? 'ponto-selecionado' : ''} onClick={() => setPontos(valor)}>{valor}</button>
                    ))}
                </div>
                <button type="submit">Adicionar</button>
            </form>
            <Popup mensagem={mensagemPopup} fechar={() => {
                setMensagemPopup('');
                if (mensagemPopup === 'Tarefa cadastrada com sucesso!') {
                    navegar(-1);
                }
            }}/>
        </main>
    );
}
export default CriarTarefa;