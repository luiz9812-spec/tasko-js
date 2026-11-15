
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './telas/Login.jsx';
import Principal from './telas/Principal.jsx';
import Cadastro from './telas/Cadastro.jsx';
import Dia from './telas/Dia.jsx';
import CriarTarefa from './telas/CriarTarefa.jsx';
import Perfil from './telas/Perfil.jsx';
import Ranking from './telas/Ranking.jsx';
import RotaPrivada from './componentes/RotaPrivada.jsx';

import './App.css';

function App() {
  console.log("App carregado")
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route element={<RotaPrivada/>}>
          <Route path="/principal" element={<Principal/>}/>
          <Route path="/dia" element={<Dia/>}/>
          <Route path="/criartarefa" element={<CriarTarefa/>}/>
          <Route path="/perfil" element={<Perfil/>}/>
          <Route path="/ranking" element={<Ranking/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
