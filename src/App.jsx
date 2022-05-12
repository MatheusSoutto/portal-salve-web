import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  /*
  * Apenas uma variável de estado que utilizamos para armazenar a carteira pública do usuário.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      /*
      * Confirma se estamos autorizados a acessar a carteira do cliente
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implemente aqui o seu método connectWallet
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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

        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}
      </div>
    </div>
  );
}
