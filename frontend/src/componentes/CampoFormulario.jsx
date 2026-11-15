import '../estilos/CampoFormulario.css';

function CampoFormulario(props) {
    return (
        <div className="campo-formulario">
            <label htmlFor={props.id}>{props.label}:</label>
            <input type={props.tipo || 'text'} name={props.id} id={props.id} value={props.valor} onChange={props.aoAlterar} required={props.obrigatorio ?? true}/>
        </div>
    );
}

export default CampoFormulario;