
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function RotaPrivada() {
    console.log("RotaPrivada foi executada!");
    const [autenticado, setAutenticado] = useState(false);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function verificarSessao() {
            try {
                const resposta = await fetch('/sessao', {
                    credentials: 'include'
                });

                setAutenticado(resposta.ok);
            } catch (erro) {
                console.error('Erro ao verificar sessão:', erro);
                setAutenticado(false);
            } finally {
                setCarregando(false);
            }
        }

        verificarSessao();
        //console.log("Status da sessão:", resposta.status);
    }, []);

    //console.log("RotaPrivada:", { carregando, autenticado });

    if (carregando) {
        return <p>Verificando sessão...</p>;
    }

    if (!autenticado) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RotaPrivada;
