import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import { Loading } from './Loading.jsx';

export default function App() {

  /*
  * Apenas uma variável de estado que utilizamos para armazenar a carteira pública do usuário.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  /**
   * Cria uma variável para guardar o endereço do contrato após o deploy!
   */
  const contractAddress = "0xc7B0E8846cdB6E1EFBf637CD416499eB73f3eC83";
  const contractABI = abi.abi;

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

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de salves...", count.toNumber());
        /*
        * Executar o tchauzinho a partir do contrato inteligente
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Minerando...", waveTxn.hash);
        setIsLoading(true);

        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);
        setIsLoading(false);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total de salves recuperado...", count.toNumber());
        
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o msoutto e sou desenvolvedor back end. Estou aprendendo desenvolvimento blockchain, sabia? Legal, né? Conecte sua carteira Ethereum wallet e me manda um salve!
        </div>

        
        <button 
          className="waveButton disabled:opacity-60" 
          onClick={wave}
          disabled={isLoading}
        >
          {isLoading ? <Loading /> : 'Mandar Salve 🌟'}
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
