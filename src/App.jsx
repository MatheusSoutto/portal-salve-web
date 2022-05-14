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
  const [allWaves, setAllWaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const contractAddress = "0xB127CdAbeC776A7f7BCc9C1700970C7e2c66aec0";
  // old: "0xf36cD0CEa046B28268CD677dd65cAf6827c50CAc";
  // old: "0x1a800ED538e46A05a62589Ce9bD0A25eeAA49AAf";
  // old: "0xc7B0E8846cdB6E1EFBf637CD416499eB73f3eC83";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possui a Metamask instalada!");
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
        setCurrentAccount(account);

        // certeza que temos uma carteira conectada
        getAllWaves();
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
      setIsLoading(true);
      
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask não encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  }

  const wave = async (event) => {
    event.preventDefault();
    
    try {
      setIsLoading(true);
      
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
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Minerando...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total de salves recuperado...", count.toNumber());
        
        setMessage("");
        // certeza que temos uma carteira conectada
        getAllWaves();
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  }

  /*
  * Método para consultar todos os tchauzinhos do contrato
  */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Chama o método getAllWaves do seu contrato inteligente
         */
        const waves = await wavePortalContract.getAllWaves();
        console.log(waves);

        /*
         * Apenas precisamos do endereço, data/horário, e mensagem na nossa tela, então vamos selecioná-los
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Armazenando os dados
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Objeto Ethereum não existe!")
      }
    } catch (error) {
      console.log(error);
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

        <div className="p-4 relative rounded-2xl flex flex-col items-center shadow-lg w-[calc(100vw-2rem)] md:w-auto">
        {currentAccount ? (
          <form className="my-4 w-full items-center" onSubmit={wave}>
            <textarea 
              className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-600 border-zinc-300 bg-transparent rounded-md focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 focus:outline-none resize-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
              placeholder="Salve! Que projeto interessante..."
              onChange={event => setMessage(event.target.value)}
            />
            <footer className="flex gap-2 mt-2">
              <button 
                type="submit"
                className="p-2 bg-indigo-600 rounded-md border-transparent flex-1 flex justify-center items-center text-sm text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-70 disabled:hover:bg-indigo-600"
                disabled={message.length == 0 || isLoading}
              >
                {isLoading ? <Loading /> : 'Mandar Salve 🌟'}
              </button>
            </footer>
          </form>
        ) : (
          <button className="p-2 bg-indigo-600 rounded-md border-transparent flex-1 flex justify-center items-center text-sm text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:hover:bg-indigo-500"
            onClick={connectWallet}
            disabled={isLoading}
          >
            Conectar carteira
          </button>
        )}
        </div>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endereço: {wave.address}</div>
              <div>Data/Horário: {wave.timestamp.toString()}</div>
              <div>Mensagem: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
