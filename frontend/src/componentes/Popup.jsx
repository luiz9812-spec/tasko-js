import '../estilos/Popup.css';

function Popup(props) {
    if (!props.mensagem) return null;

    const confirmacao = Boolean(props.confirmar);

    return (
        <div className="fundo-popup" onClick={props.fechar}>
            <div className="caixa-popup" onClick={(evento) => evento.stopPropagation()}>
                <h2>{confirmacao ? 'Confirmar exclusão' : 'Atenção!'}</h2>

                <p>{props.mensagem}</p>

                {confirmacao ? (
                    <div className="botoes-popup">
                        <button type="button" onClick={props.fechar}>{props.textoCancelar ?? 'Não'}</button>

                        <button type="button" className="botao-confirmar-exclusao" onClick={props.confirmar}>{props.textoConfirmar ?? 'Sim, excluir'}</button>
                    </div>
                ) : (
                    <button type="button" onClick={props.fechar}>Entendi</button>
                )}
            </div>
        </div>
    );
}

export default Popup;
