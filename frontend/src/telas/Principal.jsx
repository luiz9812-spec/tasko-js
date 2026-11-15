import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/Principal.css';
import Popup from '../componentes/Popup';
import Cabecalho from '../componentes/Cabecalho.jsx';
import Rodape from '../componentes/Rodape.jsx';
import CartaoDia from '../componentes/CartaoDia.jsx';

function Principal() {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregado] = useState(true);
    const [dias, setDias] = useState([]);
    const navegar = useNavigate();
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [mensagemPopup, setMensagemPopup] = useState('');

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
                const respostaDias = await fetch('/dias', {
                    credentials: 'include'
                });
                if (!respostaDias.ok) {
                    throw new Error('Não foi possível buscar os dias');
                }
                const dadosDias = await respostaDias.json();
                setDias(dadosDias);
            } catch (erro) {
                console.error('Erro ao verificar sessão: ', erro);
                navegar('/', {replace: true});
            } finally {
                setCarregado(false);
            }
        }
        verificarSessao();
    }, [navegar]);

    async function cadastrarDia() {
        if (!dataSelecionada) {
            setMensagemPopup('Selecione uma data para continuar.');
            return;
        }

        try {
            const resposta = await fetch('/dias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    data: dataSelecionada
                })
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.mensagem || 'Não foi possível cadastrar o dia.');
            }

            const respostaDias = await fetch('/dias', {
                credentials: 'include'
            });

            if (!respostaDias.ok) {
                throw new Error('Dia criado, mas não foi possível atualizar a lista.');
            }

            const dadosDias = await respostaDias.json();
            setDias(dadosDias);
            setDataSelecionada('');
            setMensagemPopup('Dia cadastrado com sucesso!');
        } catch (erro) {
            setMensagemPopup(erro.message || 'Erro ao cadastrar o dia.');
        }
    }

    async function atualizarDias() {
        const resposta = await fetch('/dias', {
            credentials: 'include'
        });

        if (!resposta.ok) {
            throw new Error('Não foi possível atualizar a lista de dias.');
        }

        const dadosDias = await resposta.json();
        setDias(dadosDias);
    }

    if (carregando) {
        return <p>Verificando sessão...</p>;
    }

    if (!usuario) {
        return null;
    }

    return (
        <main className='principal'>
            <Cabecalho usuario={usuario} />

            <section className='area-dias'>
                <div className='titulo-dias'>
                    <div>
                        <p>Organize duas tarefas e evolua!</p>
                    </div>
                    <label className='controle-adicionar-dia'>
                        <input type="date" name="data-dia" id="data-dia" value={dataSelecionada} 
                        onChange={(evento) => setDataSelecionada(evento.target.value)} aria-label='Data do novo dia' min={new Date().toLocaleDateString('en-CA')} />
                        <button type="button" className='botao-adicionar' onClick={cadastrarDia}>+Dia</button>
                    </label>
                </div>

                <div className='lista-dias'>
                    {dias.map((dia) => (
                        <CartaoDia key={dia.id_dia} dia={dia} aoClonar={atualizarDias}/>
                    ))}
                </div>
            </section>
            <Rodape paginaAtiva="principal" />
            <Popup mensagem={mensagemPopup} fechar={() => setMensagemPopup('')}/>
        </main>
    );
}

export default Principal;