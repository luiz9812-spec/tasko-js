import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import Popup from '../componentes/Popup.jsx';
import '../estilos/Dia.css';
import CartaoTarefa from '../componentes/CartaoTarefa.jsx';

function Dia() {
    const navegar = useNavigate();
    const [dia, setDia] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [parametros] = useSearchParams();
    const idDia = parametros.get('id');
    const [mensagemPopup, setMensagemPopup] = useState('');
    const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);
    const [confirmarExclusaoDia, setConfirmarExclusaoDia] = useState(false);
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
    const [novoNome, setNovoNome] = useState('');

    useEffect(() => {
        async function buscarDia() {
            try {
                const resposta = await fetch(`/dias/${idDia}`, {
                    credentials: 'include'
                });

                if (!resposta.ok) {
                    throw new Error('Não foi possível buscar o dia');
                }

                const dados = await resposta.json();
                
                setDia(dados);

                const respostaTarefas = await fetch(`/dias/${idDia}/tarefas`, {
                    credentials: 'include'
                });

                if (!respostaTarefas.ok) {
                    throw new Error('Não foi possível buscar as tarefas');
                }

                const dadosTarefas = await respostaTarefas.json();
                setTarefas(dadosTarefas);

            } catch (erro) {
                console.error('Erro ao buscar o dia: ', erro);
            }
        }
        if (idDia) {
            buscarDia();
        }
    }, [idDia]);

    async function excluirDia() {
    if (!dia) return;

    try {
        const resposta = await fetch(`/dias/${dia.id_dia}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!resposta.ok) {
            const mensagem = await resposta.text();
            throw new Error(mensagem || 'Não foi possível excluir o dia.');
        }

        setConfirmarExclusaoDia(false);
        navegar('/principal');
    } catch (erro) {
        setConfirmarExclusaoDia(false);
        setMensagemPopup(erro.message || 'Erro ao excluir o dia.');
    }
}

    async function concluirTarefa(idTarefa) {
        try {
            const resposta = await fetch(`/tarefas/${idTarefa}/concluir`,
                {
                    method: 'PATCH',
                    credentials: 'include'
                }
            );

            if (!resposta.ok) {
                const mensagem = await resposta.text();
                throw new Error(mensagem || 'Essa tarefa já foi concluída!');
            }

            const resultado = await resposta.json();

            setTarefas((tarefasAtuais) => tarefasAtuais.map((tarefa) => tarefa.id_tarefa === idTarefa ? { ...tarefa, concluida: true } : tarefa));

            console.log("Pontos ganhos:", resultado.pontosAdicionados);
        } catch (erro) {
            //console.error('Erro ao concluir tarefa: ', erro);
            setMensagemPopup(erro.message || 'Não foi possível concluir a tarefa.');
        }
    }

    async function alterarTarefa(idTarefa) {
        try {
            const resposta = await fetch(`/tarefas/${idTarefa}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    nome: novoNome
                })
            });

            if (!resposta.ok) {
                const mensagem = await resposta.text();
                throw new Error(mensagem || 'Não foi possível alterar a tarefa.');
            }

            setTarefas((tarefasAtuais) => tarefasAtuais.map((tarefa) => tarefa.id_tarefa === idTarefa ? { ...tarefa, nome: novoNome.trim() } : tarefa));

            setTarefaEmEdicao(null);
            setNovoNome('');
            setMensagemPopup('Tarefa alterada com sucesso!');
        } catch (erro) {
            setMensagemPopup(erro.message || 'Erro ao alterar a tarefa.');
        }
    }

    async function excluirTarefa() {
    if (!tarefaParaExcluir) return;

    try {
        const resposta = await fetch(`/tarefas/${tarefaParaExcluir.id_tarefa}`,
            {
                method: 'DELETE',
                credentials: 'include'
            }
        );

        if (!resposta.ok) {
            const mensagem = await resposta.text();
            throw new Error(mensagem || 'Não foi possível excluir a tarefa.');
        }

        setTarefas((tarefasAtuais) => tarefasAtuais.filter((tarefa) => tarefa.id_tarefa !== tarefaParaExcluir.id_tarefa));

        setTarefaParaExcluir(null);
        setMensagemPopup('Tarefa excluída com sucesso!');
    } catch (erro) {
        setTarefaParaExcluir(null);
        setMensagemPopup(erro.message || 'Erro ao excluir a tarefa.');
    }
}

    return (
        <main className="tela-dia">
            <header className="cabecalho-dia">
                <button type="button" className="botao-voltar" onClick={() => navegar('/principal')}>←</button>
                <h1>DIA: {dia ? new Date(`${dia.data}T12:00:00`).toLocaleDateString('pt-BR') : 'Carregando...'}</h1>
                <button type="button" className="botao-excluir-dia" onClick={() => setConfirmarExclusaoDia(true)}>Excluir</button>
            </header>
            <section className="area-tarefas">
                <button type="button" className="botao-nova-tarefa" disabled={!dia} onClick={() => navegar(`/criartarefa?id=${dia.id_dia}`)}>+ Tarefa</button>
                <div className="lista-tarefas">                   
                    {tarefas.map((tarefa) => (
                        <CartaoTarefa key={tarefa.id_tarefa} tarefa={tarefa} tarefaEmEdicao={tarefaEmEdicao} novoNome={novoNome} setNovoNome={setNovoNome} iniciarEdicao={(tarefa) => {
                                setTarefaEmEdicao(tarefa.id_tarefa);
                                setNovoNome(tarefa.nome);
                            }}
                            cancelarEdicao={() => {
                                setTarefaEmEdicao(null);
                                setNovoNome('');
                            }}
                            salvarEdicao={alterarTarefa}
                            concluirTarefa={concluirTarefa}
                            solicitarExclusao={setTarefaParaExcluir}
                        />
                    ))}
                </div>
            </section>
            <Popup mensagem={mensagemPopup} fechar={() => setMensagemPopup('')}/>
            <Popup mensagem={tarefaParaExcluir ? 
                `Deseja excluir a tarefa "${tarefaParaExcluir.nome}"?` : ''}
                fechar={() => setTarefaParaExcluir(null)} 
                confirmar={excluirTarefa} 
                textoConfirmar="Sim, excluir" 
                textoCancelar="Não"
            />
            <Popup mensagem={confirmarExclusaoDia ? 'Tem certeza que deseja excluir este dia e todas as suas tarefas associadas?' : ''}
                fechar={() => setConfirmarExclusaoDia(false)}
                confirmar={excluirDia}
                textoConfirmar="Sim, excluir"
                textoCancelar="Não"
            />
        </main>
    );
}

export default Dia;