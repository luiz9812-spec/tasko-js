
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartaoDia(props) {
    const navegar = useNavigate();

    const [mostrarClonagem, setMostrarClonagem] = useState(false);
    const [novaData, setNovaData] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);

    const hoje = new Date();
    const dataMinima = [hoje.getFullYear(), String(hoje.getMonth() + 1).padStart(2, '0'), String(hoje.getDate()).padStart(2, '0')].join('-');

    async function clonar(evento) {
        evento.preventDefault();
        evento.stopPropagation();
        setMensagem('');

        if (!novaData) {
            setMensagem('Selecione uma data.');
            return;
        }

        setCarregando(true);

        try {
            const resposta = await fetch(`/dias/${props.dia.id_dia}/clonar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ novaData })
                }
            );

            const texto = await resposta.text();

            if (!resposta.ok) {
                throw new Error(texto);
            }

            await props.aoClonar();

            setMensagem('Dia clonado com sucesso!');
            setNovaData('');
            setMostrarClonagem(false);
        } catch (erro) {
            setMensagem(erro.message || 'Não foi possível clonar o dia.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <article
            className="cartao-dia" onClick={() => navegar(`/dia?id=${props.dia.id_dia}`)}>
                <span className="icone-dia">📅</span>

            <h3>
                {new Date(`${props.dia.data}T12:00:00`).toLocaleDateString('pt-BR')}
            </h3>

            <ul className="previa-tarefas">{props.dia.tarefas.map((tarefa) => (<li key={tarefa.id_tarefa}>{tarefa.nome}</li>))}</ul>

            {props.dia.total_tarefas > 3 && (
                <p className="mais-tarefas">+{props.dia.total_tarefas - 3} tarefas</p>
            )}

            <p className="ver-tarefas">Ver tarefas</p>

            <div onClick={(evento) => evento.stopPropagation()}>
                <button type="button" className="botao-clonar-dia" onClick={() => {
                    setMostrarClonagem(!mostrarClonagem);
                    setMensagem('');
                    }}>
                        Clonar dia
                </button>

                {mostrarClonagem && (
                    <form onSubmit={clonar}>
                        <label htmlFor={`nova-data-${props.dia.id_dia}`}>
                            Data do novo dia
                        </label>

                        <input
                            type="date"
                            id={`nova-data-${props.dia.id_dia}`}
                            value={novaData}
                            min={dataMinima}
                            onChange={(evento) => setNovaData(evento.target.value)}
                            required
                        />

                        <button type="submit" disabled={carregando}>
                            {carregando ? 'Clonando...' : 'Confirmar clonagem'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMostrarClonagem(false)}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>
                    </form>
                )}

                {mensagem && <p role="status">{mensagem}</p>}
            </div>
        </article>
    );
}

export default CartaoDia;
