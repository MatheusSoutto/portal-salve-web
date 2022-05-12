import React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o msoutto e sou desenvolvedor back end. Estou aprendendo desenvolvimento blockchain, sabia? Legal, né? Conecte sua carteira Ethereum wallet e me manda um salve!
        </div>

        <button className="waveButton" onClick={wave}>
          Mandar Salve 🌟
        </button>
      </div>
    </div>
  );
}
