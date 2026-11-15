import '../estilos/Rodape.css';

import { useNavigate } from 'react-router-dom';

function Rodape(props) {
    const navegar = useNavigate();
    return(
        <nav className='navegacao-inferior'>
            <button type='button' className={`item-navegacao ${props.paginaAtiva === 'principal' ? 'ativo' : ''}`}
                disabled={props.paginaAtiva === 'principal'} onClick={() => navegar('/principal')}><span>▦</span><small>Principal</small></button>

            <button type='button' className={`item-navegacao ${props.paginaAtiva === 'ranking' ? 'ativo' : ''}`}
                disabled={props.paginaAtiva === 'ranking'} onClick={() => navegar('/ranking')}><span>🏆</span><small>Ranking</small></button>

            <button type='button' className={`item-navegacao ${props.paginaAtiva === 'perfil' ? 'ativo' : ''}`}
                disabled={props.paginaAtiva === 'perfil'} onClick={() => navegar('/perfil')}><span>👤</span><small>Perfil</small></button>

        </nav>
    );
}
export default Rodape;