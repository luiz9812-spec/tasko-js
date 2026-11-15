function CartaoTarefa(props) {
    return (
        <article className={`cartao-tarefa ${props.tarefa.concluida ? 'tarefa-concluida' : ''}`}>
            <input type="checkbox" checked={Boolean(props.tarefa.concluida)} disabled={Boolean(props.tarefa.concluida)} onChange={() => props.concluirTarefa(props.tarefa.id_tarefa)}/>

            {props.tarefaEmEdicao === props.tarefa.id_tarefa ? (
                <>
                    <input type="text" value={props.novoNome} onChange={(evento) => props.setNovoNome(evento.target.value)} aria-label="Novo nome da tarefa" autoFocus/>

                    <button type="button" onClick={() => props.salvarEdicao(props.tarefa.id_tarefa)}>Salvar</button>

                    <button type="button" onClick={props.cancelarEdicao}>Cancelar</button>
                </>
            ) : (
                <span>{props.tarefa.nome}</span>
            )}

            <button type="button" className="botao-alterar-tarefa" aria-label={`Alterar tarefa ${props.tarefa.nome}`} disabled={Boolean(props.tarefa.concluida)} onClick={() => props.iniciarEdicao(props.tarefa)}>✏️</button>

            <button type="button" className="botao-excluir-tarefa" aria-label={`Excluir tarefa ${props.tarefa.nome}`} disabled={Boolean(props.tarefa.concluida)} onClick={() => props.solicitarExclusao(props.tarefa)}>🗑</button>
        </article>
    );
}

export default CartaoTarefa;
