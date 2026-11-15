import '../estilos/Cabecalho.css';
import calcularNivel from '../utilitarios/calcularNivel.js';

function Cabecalho(props) {
    const nivel = calcularNivel(props.usuario.pontos);
    return (
        <header className="cabecalho-principal">
            <div className="informacoes-usuario">
                <div className="avatar">
                    {props.usuario.nome?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <p className="saudacao">Bem-vindo de volta,</p>
                    <h1>{props.usuario.nome}!</h1>
                </div>
            </div>

            <div className="progresso-usuario">
                <span className="nivel">NÍVEL {nivel}</span>
                <span className="xp">
                    ⭐ {props.usuario.pontos ?? 0} XP
                </span>
            </div>
        </header>
    );
}

export default Cabecalho;
